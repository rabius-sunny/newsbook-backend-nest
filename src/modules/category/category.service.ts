import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Category } from '@prisma/client';
import { handlePrismaError } from '../../common/filters/prisma-exception.filter';
import { ApiResponse, PaginationMeta, ServiceResult } from '../../common/types';
import { calculateOffset, calculatePagination } from '../../common/utils';
import { PrismaService } from '../../prisma';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import {
  CategoryTreeNode,
  CategoryWithArticleCount,
  CategoryWithParent,
} from './types';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async getCategories(params: { page?: number; limit?: number } = {}): Promise<
    ServiceResult<{
      categories: CategoryWithArticleCount[];
      meta: PaginationMeta;
    }>
  > {
    try {
      const page = params.page || 1;
      const limit = params.limit || 20;
      const offset = calculateOffset(page, limit);

      // Get total count
      const totalCount = await this.prisma.category.count({
        where: { isActive: true },
      });

      // Get paginated categories with parent relation and article count
      const categories = await this.prisma.category.findMany({
        where: { isActive: true },
        include: {
          parent: {
            select: { id: true, name: true, slug: true },
          },
          _count: {
            select: { articles: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      });

      const categoriesData: CategoryWithArticleCount[] = categories.map(
        (cat) => ({
          ...cat,
          parent: cat.parent,
          articleCount: cat._count.articles,
        }),
      );

      return {
        success: true,
        message: 'Categories retrieved successfully',
        data: {
          categories: categoriesData,
          meta: calculatePagination(totalCount, { page, limit }),
        },
      };
    } catch (error) {
      return handlePrismaError(error);
    }
  }

  async getCategoryTree(): Promise<ServiceResult<CategoryTreeNode[]>> {
    try {
      const categories = await this.prisma.category.findMany({
        where: { isActive: true },
        orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
        select: {
          id: true,
          name: true,
          image: true,
          slug: true,
          parentId: true,
          isActive: true,
          path: true,
          createdAt: true,
        },
      });

      // Build hierarchy without circular references
      const categoryMap = new Map<number, CategoryTreeNode>();
      const rootCategories: CategoryTreeNode[] = [];

      // First pass: create all categories without parent references
      categories.forEach((cat) => {
        categoryMap.set(cat.id, { ...cat, children: [] });
      });

      // Second pass: build hierarchy
      categories.forEach((cat) => {
        const category = categoryMap.get(cat.id);
        if (!category) return;

        if (cat.parentId) {
          const parent = categoryMap.get(cat.parentId);
          if (parent) {
            parent.children.push(category);
          }
        } else {
          rootCategories.push(category);
        }
      });

      return {
        success: true,
        message: 'Category tree retrieved successfully',
        data: rootCategories,
      };
    } catch (error) {
      return handlePrismaError(error);
    }
  }

  async getCategoryBySlug(
    slug: string,
  ): Promise<ServiceResult<CategoryWithParent>> {
    try {
      const category = await this.prisma.category.findUnique({
        where: { slug },
        include: {
          parent: {
            select: { id: true, name: true, slug: true },
          },
        },
      });

      if (!category) {
        throw new NotFoundException(`Category with slug '${slug}' not found`);
      }

      return {
        success: true,
        message: 'Category retrieved successfully',
        data: category,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      return handlePrismaError(error);
    }
  }

  async getCategoryById(
    id: number,
  ): Promise<ServiceResult<CategoryWithParent>> {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id },
        include: {
          parent: {
            select: { id: true, name: true, slug: true },
          },
        },
      });

      if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }

      return {
        success: true,
        message: 'Category retrieved successfully',
        data: category,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      return handlePrismaError(error);
    }
  }

  async createCategory(
    data: CreateCategoryDto,
  ): Promise<ServiceResult<Category>> {
    try {
      // Validate parent if provided
      if (data.parentId) {
        await this.validateParentCategory(data.parentId);
      }

      // Calculate depth and path
      const { depth, path } = await this.calculateHierarchy(
        data.parentId ?? null,
        data.slug,
      );

      const category = await this.prisma.category.create({
        data: {
          ...data,
          depth,
          path,
        },
      });

      return {
        success: true,
        message: 'Category created successfully',
        data: category,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      return handlePrismaError(error);
    }
  }

  async updateCategory(
    id: number,
    data: UpdateCategoryDto,
  ): Promise<ServiceResult<Category>> {
    try {
      // Check if category exists
      const existing = await this.getCategoryById(id);
      if (!existing.data) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }

      // Validate parent if changing
      if (data.parentId !== undefined && data.parentId !== null) {
        await this.validateParentCategory(data.parentId, id);
      }

      // Recalculate depth and path if parent changed
      let depth: number | undefined;
      let path: string | undefined;
      if (data.parentId !== undefined) {
        const hierarchy = await this.calculateHierarchy(
          data.parentId,
          existing.data.slug,
        );
        depth = hierarchy.depth;
        path = hierarchy.path;
      }

      const category = await this.prisma.category.update({
        where: { id },
        data: {
          ...data,
          ...(depth !== undefined && { depth }),
          ...(path !== undefined && { path }),
        },
      });

      return {
        success: true,
        message: 'Category updated successfully',
        data: category,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      return handlePrismaError(error);
    }
  }

  async deleteCategory(id: number): Promise<ApiResponse> {
    try {
      // Check if category exists
      await this.getCategoryById(id);

      // Check if category has children
      const childrenCount = await this.prisma.category.count({
        where: { parentId: id },
      });

      if (childrenCount > 0) {
        throw new BadRequestException(
          'Cannot delete category with subcategories. Delete children first.',
        );
      }

      await this.prisma.category.delete({
        where: { id },
      });

      return {
        success: true,
        message: 'Category deleted successfully',
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      return handlePrismaError(error);
    }
  }

  async getCategoryChildren(id: number): Promise<ServiceResult<Category[]>> {
    try {
      // Check if category exists
      await this.getCategoryById(id);

      const children = await this.prisma.category.findMany({
        where: { parentId: id, isActive: true },
        orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
      });

      return {
        success: true,
        message: 'Category children retrieved successfully',
        data: children,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      return handlePrismaError(error);
    }
  }

  private async validateParentCategory(
    parentId: number,
    currentCategoryId?: number,
  ): Promise<void> {
    const parent = await this.prisma.category.findUnique({
      where: { id: parentId },
    });

    if (!parent) {
      throw new NotFoundException(
        `Parent category with ID ${parentId} not found`,
      );
    }

    // Check hierarchy depth (max 3 levels)
    if (parent.depth >= 2) {
      throw new BadRequestException(
        'Cannot create subcategory at depth greater than 2',
      );
    }

    // Prevent circular reference
    if (currentCategoryId && parentId === currentCategoryId) {
      throw new BadRequestException('Category cannot be its own parent');
    }
  }

  private async calculateHierarchy(
    parentId: number | null,
    slug: string,
  ): Promise<{ depth: number; path: string }> {
    if (!parentId) {
      return { depth: 0, path: slug };
    }

    const parent = await this.prisma.category.findUnique({
      where: { id: parentId },
      select: { depth: true, path: true },
    });

    if (!parent) {
      return { depth: 0, path: slug };
    }

    return {
      depth: parent.depth + 1,
      path: parent.path ? `${parent.path}/${slug}` : slug,
    };
  }
}
