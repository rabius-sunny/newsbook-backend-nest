import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { handlePrismaError } from '../../common/filters/prisma-exception.filter';
import { ApiResponse, PaginationMeta, ServiceResult } from '../../common/types';
import { calculateOffset, calculatePagination } from '../../common/utils';
import { PrismaService } from '../../prisma';
import { CreateUserDto, UpdateUserDto, UserQueryDto } from './dto';
import { UserPublic, UserWithArticleCount } from './types';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers(params: UserQueryDto): Promise<
    ServiceResult<{
      users: UserPublic[];
      meta: PaginationMeta;
    }>
  > {
    try {
      const page = params.page || 1;
      const limit = params.limit || 10;
      const offset = calculateOffset(page, limit);

      // Build where conditions
      const where: Prisma.UserWhereInput = {};

      if (params.q) {
        where.name = { contains: params.q, mode: 'insensitive' };
      }

      if (params.role) {
        where.role = params.role;
      }

      if (params.active !== undefined) {
        where.isActive = params.active === 'true';
      }

      // Apply sorting
      const orderBy: Prisma.UserOrderByWithRelationInput = {};
      const sortBy = params.sortBy || 'createdAt';
      const sortOrder = params.sortOrder || 'desc';
      orderBy[sortBy] = sortOrder;

      // Get total count
      const totalCount = await this.prisma.user.count({ where });

      // Get paginated users
      const users = await this.prisma.user.findMany({
        where,
        orderBy,
        take: limit,
        skip: offset,
        select: {
          id: true,
          email: true,
          name: true,
          bio: true,
          avatar: true,
          role: true,
          isActive: true,
          meta: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return {
        success: true,
        message: 'Users retrieved successfully',
        data: {
          users,
          meta: calculatePagination(totalCount, { page, limit }),
        },
      };
    } catch (error) {
      return handlePrismaError(error);
    }
  }

  async getAuthors(): Promise<ServiceResult<UserWithArticleCount[]>> {
    try {
      const authors = await this.prisma.user.findMany({
        where: { isActive: true },
        select: {
          id: true,
          email: true,
          name: true,
          bio: true,
          avatar: true,
          role: true,
          isActive: true,
          meta: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: { articles: true },
          },
        },
        orderBy: { name: 'asc' },
      });

      const authorsData: UserWithArticleCount[] = authors.map((author) => ({
        ...author,
        articleCount: author._count.articles,
      }));

      return {
        success: true,
        message: 'Authors retrieved successfully',
        data: authorsData,
      };
    } catch (error) {
      return handlePrismaError(error);
    }
  }

  async getUserById(id: number): Promise<ServiceResult<UserPublic>> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          bio: true,
          avatar: true,
          role: true,
          isActive: true,
          meta: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return {
        success: true,
        message: 'User retrieved successfully',
        data: user,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      return handlePrismaError(error);
    }
  }

  async getUserByEmail(email: string): Promise<ServiceResult<User>> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new NotFoundException(`User with email '${email}' not found`);
      }

      return {
        success: true,
        message: 'User retrieved successfully',
        data: user,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      return handlePrismaError(error);
    }
  }

  async createUser(data: CreateUserDto): Promise<ServiceResult<UserPublic>> {
    try {
      // TODO: Hash password before storing
      const user = await this.prisma.user.create({
        data,
        select: {
          id: true,
          email: true,
          name: true,
          bio: true,
          avatar: true,
          role: true,
          isActive: true,
          meta: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return {
        success: true,
        message: 'User created successfully',
        data: user,
      };
    } catch (error) {
      return handlePrismaError(error);
    }
  }

  async updateUser(
    id: number,
    data: UpdateUserDto,
  ): Promise<ServiceResult<UserPublic>> {
    try {
      // Check if user exists
      await this.getUserById(id);

      const user = await this.prisma.user.update({
        where: { id },
        data,
        select: {
          id: true,
          email: true,
          name: true,
          bio: true,
          avatar: true,
          role: true,
          isActive: true,
          meta: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return {
        success: true,
        message: 'User updated successfully',
        data: user,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      return handlePrismaError(error);
    }
  }

  async deleteUser(id: number): Promise<ApiResponse> {
    try {
      // Check if user exists
      await this.getUserById(id);

      await this.prisma.user.delete({
        where: { id },
      });

      return {
        success: true,
        message: 'User deleted successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      return handlePrismaError(error);
    }
  }

  async getUserArticleCount(id: number): Promise<ServiceResult<number>> {
    try {
      // Check if user exists
      await this.getUserById(id);

      const count = await this.prisma.article.count({
        where: { authorId: id },
      });

      return {
        success: true,
        message: 'Article count retrieved successfully',
        data: count,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      return handlePrismaError(error);
    }
  }
}
