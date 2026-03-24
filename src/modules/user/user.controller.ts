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
import { ZodResponse } from 'nestjs-zod'
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
  type UserResponseDtoType,
} from '@/lib/dtos/user'
import type { IUserController } from '@/lib/types/modules/user'
import { UsersService } from './user.service'

@ApiBearerAuth()
@Controller('users')
export class UserController implements IUserController {
  constructor(private readonly service: UsersService) {}

  @Get()
  @ZodResponse({
    type: [UserResponseDto],
  })
  getUsers(): Promise<UserResponseDtoType[]> {
    return this.service.getUsers()
  }

  @Get(':uuid')
  @ZodResponse({
    type: UserResponseDto,
  })
  getUserByUuid(
    @Param('uuid', ParseUUIDPipe) uuid: string
  ): Promise<UserResponseDtoType> {
    return this.service.getUserByUuid(uuid)
  }

  @Post()
  @ZodResponse({
    type: UserResponseDto,
  })
  createUser(@Body() userData: CreateUserDto): Promise<UserResponseDtoType> {
    return this.service.createUser(userData as Prisma.UserCreateInput)
  }

  @Patch(':uuid')
  @ZodResponse({
    type: UserResponseDto,
  })
  updateUser(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() partialUserDto: UpdateUserDto
  ): Promise<UserResponseDtoType> {
    return this.service.updateUserByUuid(uuid, partialUserDto)
  }

  @Delete(':uuid')
  @ZodResponse({
    type: UserResponseDto,
  })
  deleteUser(
    @Param('uuid', ParseUUIDPipe) uuid: string
  ): Promise<UserResponseDtoType> {
    return this.service.deleteUserByUuid(uuid)
  }
}
