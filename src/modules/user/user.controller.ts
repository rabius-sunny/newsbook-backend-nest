import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Roles } from '../../common/decorators';
import { ZodValidationPipe } from '../../common/pipes';
import type { CreateUserDto, UpdateUserDto, UserQueryDto } from './dto';
import { userCreateSchema, userQuerySchema, userUpdateSchema } from './dto';
import { UserService } from './user.service';

@Controller('admin/users')
@Roles('admin')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(
    @Query(new ZodValidationPipe(userQuerySchema)) query: UserQueryDto,
  ) {
    return this.userService.getUsers(query);
  }

  @Get('authors')
  async getAuthors() {
    return this.userService.getAuthors();
  }

  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserById(id);
  }

  @Get(':id/article-count')
  async getUserArticleCount(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserArticleCount(id);
  }

  @Post()
  async createUser(
    @Body(new ZodValidationPipe(userCreateSchema)) dto: CreateUserDto,
  ) {
    return this.userService.createUser(dto);
  }

  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(userUpdateSchema)) dto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, dto);
  }

  @Patch(':id/toggle-active')
  async toggleUserActive(@Param('id', ParseIntPipe) id: number) {
    return this.userService.toggleActive(id);
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }
}
