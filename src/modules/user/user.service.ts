import { Injectable } from '@nestjs/common'
import { Prisma, User } from '@prisma/client'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcrypt'
import { IUserService } from '@/lib/types/modules/user'
import { UserRepository } from './user.repository'

@Injectable()
export class UsersService implements IUserService {
  constructor(
    private repository: UserRepository,
    private configService: ConfigService
  ) {}

  private hashPassword(password: string) {
    return bcrypt.hash(password, this.configService.getOrThrow('saltRounds'))
  }

  getUsers(): Promise<User[]> {
    return this.repository.users({})
  }

  getUserByUuid(uuid: string): Promise<User | null> {
    return this.repository.user({ uuid })
  }

  deleteUserByUuid(uuid: string): Promise<User> {
    return this.repository.deleteUser({ uuid })
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    data.password = await this.hashPassword(data.password)
    return this.repository.createUser(data)
  }

  async updateUserByUuid(
    uuid: string,
    data: Prisma.UserUpdateInput
  ): Promise<User> {
    if (data.password) {
      data.password = await this.hashPassword(data.password as string)
    }
    return this.repository.updateUser({ where: { uuid }, data })
  }
}
