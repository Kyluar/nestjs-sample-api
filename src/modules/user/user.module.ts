import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { UserController } from './user.controller'
import { UserRepository } from './user.repository'
import { UsersService } from './user.service'

@Module({
  imports: [ConfigModule],
  controllers: [UserController],
  providers: [UsersService, UserRepository],
  exports: [UsersService],
})
export class UserModule {}
