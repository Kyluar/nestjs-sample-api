import {
  GetUsersParams,
  IUserRepository,
  UpdateUserParams,
} from '@/lib/types/modules/user'
import { Injectable } from '@nestjs/common'
import { Prisma, User } from '@prisma/client'
import { PrismaService } from 'nestjs-prisma'

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput
  ): Promise<User | null> {
    return this.prisma.user.findUnique({ where: userWhereUniqueInput })
  }

  users(params: GetUsersParams): Promise<User[]> {
    return this.prisma.user.findMany({ ...params })
  }

  createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data })
  }

  updateUser(params: UpdateUserParams): Promise<User> {
    return this.prisma.user.update({ ...params })
  }

  deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({ where })
  }
}
