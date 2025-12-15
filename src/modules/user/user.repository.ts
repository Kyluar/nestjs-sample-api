import {
  GetUsersParams,
  IUserRepository,
  UpdateUserParams,
} from '@/lib/types/modules/user'
import { Injectable } from '@nestjs/common'
import { Prisma, User } from '@prisma/client'
import { PrismaService } from 'nestjs-prisma'
import { UserResponseDtoType } from '@/lib/dtos/user'

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  user(userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.findUniqueOrThrow({ where: userWhereUniqueInput })
  }

  users(params: GetUsersParams): Promise<User[]> {
    return this.prisma.user.findMany({ ...params })
  }

  createUser(data: Prisma.UserCreateInput): Promise<UserResponseDtoType> {
    return this.prisma.user.create({ data, omit: { password: true } })
  }

  updateUser(params: UpdateUserParams): Promise<User> {
    return this.prisma.user.update({ ...params })
  }

  deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({ where })
  }
}
