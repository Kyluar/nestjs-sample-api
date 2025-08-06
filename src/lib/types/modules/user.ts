import { Prisma, User } from '@prisma/client'
import { UserDto, PartialUserDto } from '@/lib/dtos/user'

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
  user(userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<User>
  users(params: GetUsersParams): Promise<User[]>
  createUser(data: Prisma.UserCreateInput): Promise<User>
  updateUser(params: UpdateUserParams): Promise<User>
  deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User>
}

export interface IUserService {
  getUsers(): Promise<User[]>
  getUserByUuid(uuid: string): Promise<User>
  createUser(data: Prisma.UserCreateInput): Promise<User>
  updateUserByUuid(uuid: string, data: Prisma.UserUpdateInput): Promise<User>
  deleteUserByUuid(uuid: string): Promise<User>
}

export interface IUserController {
  getUsers(): Promise<User[]>
  createUser(userData: UserDto): Promise<User>
  getUserByUuid(uuid: string): Promise<User>
  updateUser(uuid: string, partialUserDto: PartialUserDto): Promise<User>
  deleteUser(uuid: string): Promise<User>
}
