import {
  GetUsersParams,
  IUserRepository,
  UpdateUserParams,
} from '@/lib/types/modules/user'
import { Injectable, Inject } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { CustomPrismaService } from 'nestjs-prisma'
import { UserResponseDtoType } from '@/lib/dtos/user'
import { ExtendedPrismaClient } from '@/lib/config/prisma/extensions'

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @Inject('PrismaService')
    private readonly prisma: CustomPrismaService<ExtendedPrismaClient>
  ) {}

  user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput
  ): Promise<UserResponseDtoType> {
    return this.prisma.client.user.findUniqueOrThrow({
      where: userWhereUniqueInput,
    })
  }

  users(params: GetUsersParams): Promise<UserResponseDtoType[]> {
    return this.prisma.client.user.findMany({ ...params })
  }

  createUser(data: Prisma.UserCreateInput): Promise<UserResponseDtoType> {
    return this.prisma.client.user.create({ data })
  }

  updateUser(params: UpdateUserParams): Promise<UserResponseDtoType> {
    return this.prisma.client.user.update({ ...params })
  }

  deleteUser(where: Prisma.UserWhereUniqueInput): Promise<UserResponseDtoType> {
    return this.prisma.client.user.delete({ where })
  }
}
