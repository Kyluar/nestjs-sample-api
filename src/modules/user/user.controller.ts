import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common'
import { UsersService } from './user.service'
import { UserDto } from '@/lib/dtos/user'
import { User as UserModel, Prisma } from '@prisma/client'
import { JwtAuthGuard } from 'src/guards'
import { ApiBearerAuth } from '@nestjs/swagger'

@Controller('user')
export class UserController {
  constructor(private readonly service: UsersService) {}

  @Get()
  async getUsers(): Promise<UserModel[]> {
    return this.service.users({})
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createUser(@Body() userData: UserDto): Promise<UserModel> {
    return this.service.createUser(userData as Prisma.UserCreateInput)
  }

  // @Get()
  // listUsers(
  //   @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  //   @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number
  // ) {
  //   return this.service.listUsers(limit, page)
  // }

  // @Get(':uuid')
  // getUserById(@Param('uuid') uuid: string) {
  //   return this.service.getUserByUuid(uuid)
  // }
  // @Post()
  // createUser(@Body() user: CreateUserDto) {
  //   return this.service.createUser(user)
  // }
  // @Put()
  // updateUser() {
  //   return 'You made a PUT request to update an user!'
  // }
  // @Patch(':uuid')
  // patchUser(@Param('uuid') uuid: string, @Body() user: UpdateUserDto) {
  //   return this.service.updateUser(uuid, user)
  // }
  // @Delete()
  // deleteUser() {
  //   return 'You made a DELETE request to delete an user!'
  // }
}
