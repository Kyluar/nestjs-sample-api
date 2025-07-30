import { Controller, Get, Post, Body } from '@nestjs/common'
import { UsersService } from './user.service'
import { UserDto } from '@/lib/dtos/user'
import { User as UserModel, Prisma } from '@prisma/client'
import { ApiBearerAuth } from '@nestjs/swagger'

@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly service: UsersService) {}

  @Get()
  async getUsers(): Promise<UserModel[]> {
    return this.service.users({})
  }

  @Post()
  async createUser(@Body() userData: UserDto): Promise<UserModel> {
    return this.service.createUser(userData as Prisma.UserCreateInput)
  }
}
