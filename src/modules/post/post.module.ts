import { Module } from '@nestjs/common'
import { PostController } from './post.controller'
import { PostsService } from './post.service'
import { PrismaModule } from '../prisma/prisma.module'

@Module({
  controllers: [PostController],
  providers: [PostsService],
  imports: [PrismaModule],
})
export class PostModule {}
