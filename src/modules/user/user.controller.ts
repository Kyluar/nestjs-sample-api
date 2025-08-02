import {
  Controller,
  Param,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common'
import { UsersService } from './user.service'
import { PartialUserDto, UserDto } from '@/lib/dtos/user'
import { User as UserModel, Prisma } from '@prisma/client'
import { ApiBearerAuth } from '@nestjs/swagger'
import { IUserController } from '@/lib/types/modules/user'

@ApiBearerAuth()
@Controller('user')
export class UserController implements IUserController {
  constructor(private readonly service: UsersService) {}

  @Get()
  getUsers(): Promise<UserModel[]> {
    return this.service.getUsers()
  }

  @Get(':uuid')
  getUserByUuid(
    @Param('uuid', ParseUUIDPipe) uuid: string
  ): Promise<UserModel | null> {
    return this.getUserByUuid(uuid)
  }

  @Post()
  createUser(@Body() userData: UserDto): Promise<UserModel> {
    return this.service.createUser(userData as Prisma.UserCreateInput)
  }

  @Patch(':uuid')
  updateUser(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() partialUserDto: PartialUserDto
  ): Promise<UserModel> {
    return this.service.updateUserByUuid(uuid, partialUserDto)
  }

  @Delete(':uuid')
  deleteUser(@Param('uuid', ParseUUIDPipe) uuid: string): Promise<UserModel> {
    return this.service.deleteUserByUuid(uuid)
  }
}
