import { Injectable } from '@nestjs/common'
import type { Post, Prisma } from '@prisma/client'
import type { IPostService } from '@/lib/types/modules/post'
import { PostRepository } from './post.repository'

@Injectable()
export class PostService implements IPostService {
  constructor(private repository: PostRepository) {}

  getPublishedPosts(): Promise<Post[]> {
    return this.repository.posts({ where: { published: true } })
  }

  getDraftPosts(): Promise<Post[]> {
    return this.repository.posts({ where: { published: false } })
  }

  getPostByUuid(uuid: string): Promise<Post> {
    return this.repository.post({ uuid })
  }

  createPost(data: Prisma.PostCreateInput): Promise<Post> {
    return this.repository.createPost(data)
  }

  updatePostByUuid(uuid: string, data: Prisma.PostUpdateInput): Promise<Post> {
    return this.repository.updatePost({ where: { uuid }, data })
  }

  deletePostByUuid(uuid: string): Promise<Post> {
    return this.repository.deletePost({ uuid })
  }
}
