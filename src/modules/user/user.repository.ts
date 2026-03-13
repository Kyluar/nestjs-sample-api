import { Inject, Injectable } from '@nestjs/common'
import type { Prisma } from '@prisma/client'
import type { CustomPrismaService } from 'nestjs-prisma'
import type { ExtendedPrismaClient } from '@/lib/config/prisma/extensions'
import type { UserResponseDtoType } from '@/lib/dtos/user'
import type {
  GetUsersParams,
  IUserRepository,
  UpdateUserParams,
} from '@/lib/types/modules/user'

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
