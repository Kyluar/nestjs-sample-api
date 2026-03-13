import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserRepository } from './user.repository'
import { UsersService } from './user.service'

@Module({
  controllers: [UserController],
  providers: [UsersService, UserRepository],
  exports: [UsersService],
})
export class UserModule {}
