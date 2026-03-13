import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import type { Prisma } from '@prisma/client'
import {
  CreateUserDto,
  UpdateUserDto,
  type UserResponseDtoType,
} from '@/lib/dtos/user'
import type { IUserController } from '@/lib/types/modules/user'
import { UsersService } from './user.service'

@ApiBearerAuth()
@Controller('users')
export class UserController implements IUserController {
  constructor(private readonly service: UsersService) {}

  @Get()
  getUsers(): Promise<UserResponseDtoType[]> {
    return this.service.getUsers()
  }

  @Get(':uuid')
  getUserByUuid(
    @Param('uuid', ParseUUIDPipe) uuid: string
  ): Promise<UserResponseDtoType> {
    return this.service.getUserByUuid(uuid)
  }

  @Post()
  createUser(@Body() userData: CreateUserDto): Promise<UserResponseDtoType> {
    return this.service.createUser(userData as Prisma.UserCreateInput)
  }

  @Patch(':uuid')
  updateUser(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() partialUserDto: UpdateUserDto
  ): Promise<UserResponseDtoType> {
    return this.service.updateUserByUuid(uuid, partialUserDto)
  }

  @Delete(':uuid')
  deleteUser(
    @Param('uuid', ParseUUIDPipe) uuid: string
  ): Promise<UserResponseDtoType> {
    return this.service.deleteUserByUuid(uuid)
  }
}
