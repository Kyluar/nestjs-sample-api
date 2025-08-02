import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UsersService } from './user.service'
import { UserRepository } from './user.repository'

@Module({
  controllers: [UserController],
  providers: [UsersService, UserRepository],
  exports: [UsersService],
})
export class UserModule {}
