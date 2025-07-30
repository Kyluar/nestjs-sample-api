import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UsersService } from './user.service'
import { PrismaModule } from '../prisma/prisma.module'

@Module({
  controllers: [UserController],
  providers: [UsersService],
  imports: [PrismaModule],
  exports: [UsersService],
})
export class UserModule {}
