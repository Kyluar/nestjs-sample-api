import { Prisma } from '@prisma/client'
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDtoType,
} from '@/lib/dtos/user'

export type GetUsersParams = {
  skip?: number
  take?: number
  cursor?: Prisma.UserWhereUniqueInput
  where?: Prisma.UserWhereInput
  orderBy?: Prisma.UserOrderByWithRelationInput
}

export type UpdateUserParams = {
  where: Prisma.UserWhereUniqueInput
  data: Prisma.UserUpdateInput
}

export interface IUserRepository {
  user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput
  ): Promise<UserResponseDtoType>
  users(params: GetUsersParams): Promise<UserResponseDtoType[]>
  createUser(data: Prisma.UserCreateInput): Promise<UserResponseDtoType>
  updateUser(params: UpdateUserParams): Promise<UserResponseDtoType>
  deleteUser(where: Prisma.UserWhereUniqueInput): Promise<UserResponseDtoType>
}

export interface IUserService {
  getUsers(): Promise<UserResponseDtoType[]>
  getUserByUuid(uuid: string): Promise<UserResponseDtoType>
  createUser(data: Prisma.UserCreateInput): Promise<UserResponseDtoType>
  updateUserByUuid(
    uuid: string,
    data: Prisma.UserUpdateInput
  ): Promise<UserResponseDtoType>
  deleteUserByUuid(uuid: string): Promise<UserResponseDtoType>
}

export interface IUserController {
  getUsers(): Promise<UserResponseDtoType[]>
  createUser(userData: CreateUserDto): Promise<UserResponseDtoType>
  getUserByUuid(uuid: string): Promise<UserResponseDtoType>
  updateUser(
    uuid: string,
    partialUserDto: UpdateUserDto
  ): Promise<UserResponseDtoType>
  deleteUser(uuid: string): Promise<UserResponseDtoType>
}
