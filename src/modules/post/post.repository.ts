import { Inject, Injectable } from '@nestjs/common'
import type { Post, Prisma } from '@prisma/client'
import type { CustomPrismaService } from 'nestjs-prisma'
import type { ExtendedPrismaClient } from '@/lib/config/prisma/extensions'
import type {
  GetPostsParams,
  IPostRepository,
  UpdatePostParams,
} from '@/lib/types/modules/post'

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
