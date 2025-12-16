import { Injectable, Inject } from '@nestjs/common'
import { CustomPrismaService } from 'nestjs-prisma'
import { Post, Prisma } from '@prisma/client'
import {
  IPostRepository,
  GetPostsParams,
  UpdatePostParams,
} from '@/lib/types/modules/post'
import { ExtendedPrismaClient } from '@/lib/config/prisma/extensions'

@Injectable()
export class PostRepository implements IPostRepository {
  constructor(
    @Inject('PrismaService')
    private readonly prisma: CustomPrismaService<ExtendedPrismaClient>
  ) {}

  post(postWhereUniqueInput: Prisma.PostWhereUniqueInput): Promise<Post> {
    return this.prisma.client.post.findUniqueOrThrow({
      where: postWhereUniqueInput,
    })
  }

  posts(params: GetPostsParams): Promise<Post[]> {
    return this.prisma.client.post.findMany({
      ...params,
    })
  }

  createPost(data: Prisma.PostCreateInput): Promise<Post> {
    return this.prisma.client.post.create({
      data,
    })
  }

  updatePost(params: UpdatePostParams): Promise<Post> {
    return this.prisma.client.post.update({
      ...params,
    })
  }

  deletePost(where: Prisma.PostWhereUniqueInput): Promise<Post> {
    return this.prisma.client.post.delete({
      where,
    })
  }
}
