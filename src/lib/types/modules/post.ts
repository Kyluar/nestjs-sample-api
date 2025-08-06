import { Prisma, Post } from '@prisma/client'
import { PostDto, PartialPostDto } from '@/lib/dtos/post'

export type GetPostsParams = {
  skip?: number
  take?: number
  cursor?: Prisma.PostWhereUniqueInput
  where?: Prisma.PostWhereInput
  orderBy?: Prisma.PostOrderByWithRelationInput
}

export type UpdatePostParams = {
  where: Prisma.PostWhereUniqueInput
  data: Prisma.PostUpdateInput
}

export interface IPostRepository {
  post(postWhereUniqueInput: Prisma.PostWhereUniqueInput): Promise<Post>
  posts(params: GetPostsParams): Promise<Post[]>
  createPost(data: Prisma.PostCreateInput): Promise<Post>
  updatePost(params: UpdatePostParams): Promise<Post>
  deletePost(where: Prisma.PostWhereUniqueInput): Promise<Post>
}

export interface IPostService {
  getPublishedPosts(): Promise<Post[]>
  getDraftPosts(): Promise<Post[]>
  getPostByUuid(uuid: string): Promise<Post>
  createPost(data: Prisma.PostCreateInput): Promise<Post>
  updatePostByUuid(uuid: string, data: Prisma.PostUpdateInput): Promise<Post>
  deletePostByUuid(uuid: string): Promise<Post>
}

export interface IPostController {
  getPublishedPosts(): Promise<Post[]>
  getDraftPosts(): Promise<Post[]>
  createPost(postData: PostDto): Promise<Post>
  getPostByUuid(uuid: string): Promise<Post>
  updatePost(uuid: string, partialPostDto: PartialPostDto): Promise<Post>
  deletePost(uuid: string): Promise<Post>
}
