import { Injectable } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import { Post, Prisma } from '@prisma/client'
import {
  IPostRepository,
  GetPostsParams,
  UpdatePostParams,
} from '@/lib/types/modules/post'

@Injectable()
export class PostRepository implements IPostRepository {
  constructor(private readonly prisma: PrismaService) {}

  post(
    postWhereUniqueInput: Prisma.PostWhereUniqueInput
  ): Promise<Post | null> {
    return this.prisma.post.findUnique({
      where: postWhereUniqueInput,
    })
  }

  posts(params: GetPostsParams): Promise<Post[]> {
    return this.prisma.post.findMany({
      ...params,
    })
  }

  createPost(data: Prisma.PostCreateInput): Promise<Post> {
    return this.prisma.post.create({
      data,
    })
  }

  updatePost(params: UpdatePostParams): Promise<Post> {
    return this.prisma.post.update({
      ...params,
    })
  }

  deletePost(where: Prisma.PostWhereUniqueInput): Promise<Post> {
    return this.prisma.post.delete({
      where,
    })
  }
}
