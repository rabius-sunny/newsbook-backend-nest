import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { isRootAdmin } from '../../common/constants/roles.constant';
import { handlePrismaError } from '../../common/filters/prisma-exception.filter';
import { ApiResponse, PaginationMeta, ServiceResult } from '../../common/types';
import type { JwtPayload } from '../../common/types/auth.types';
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

  async createUser(
    data: CreateUserDto,
    currentUser: JwtPayload,
  ): Promise<ServiceResult<UserPublic>> {
    try {
      // Only admins can create users (enforced by controller decorator, but double-check)
      if (currentUser.role !== 'admin') {
        throw new ForbiddenException('Only admins can create users');
      }

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
      if (error instanceof ForbiddenException) {
        throw error;
      }
      return handlePrismaError(error);
    }
  }

  async updateUser(
    id: number,
    data: UpdateUserDto,
    currentUser: JwtPayload,
  ): Promise<ServiceResult<UserPublic>> {
    try {
      // Prevent modifying root admin
      if (isRootAdmin(id)) {
        throw new ForbiddenException('Root admin account cannot be modified');
      }

      // Check if user exists
      const existingUser = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      // Only admins can modify other users
      if (currentUser.role !== 'admin') {
        throw new ForbiddenException('Only admins can modify other users');
      }

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
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      return handlePrismaError(error);
    }
  }

  async deleteUser(id: number, currentUser: JwtPayload): Promise<ApiResponse> {
    try {
      // Prevent deleting root admin
      if (isRootAdmin(id)) {
        throw new ForbiddenException('Root admin account cannot be deleted');
      }

      // Only admins can delete users (enforced by controller, but double-check)
      if (currentUser.role !== 'admin') {
        throw new ForbiddenException('Only admins can delete users');
      }

      // Check if user exists
      const existingUser = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      // Prevent non-root admins from deleting other admin users
      if (existingUser.role === 'admin' && !isRootAdmin(currentUser.sub)) {
        throw new ForbiddenException(
          'Only the root admin can delete other admin users',
        );
      }

      await this.prisma.user.delete({
        where: { id },
      });

      return {
        success: true,
        message: 'User deleted successfully',
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
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

  async toggleActive(
    id: number,
    currentUser: JwtPayload,
  ): Promise<ServiceResult<UserPublic>> {
    try {
      // Prevent toggling root admin
      if (isRootAdmin(id)) {
        throw new ForbiddenException(
          'Root admin account status cannot be changed',
        );
      }

      // Only admins can toggle user status
      if (currentUser.role !== 'admin') {
        throw new ForbiddenException('Only admins can change user status');
      }

      const existing = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      const user = await this.prisma.user.update({
        where: { id },
        data: { isActive: !existing.isActive },
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
        message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
        data: user,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      return handlePrismaError(error);
    }
  }
}
