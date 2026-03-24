import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import type { Post as PostModel, Prisma } from '@prisma/client'
import { ZodResponse } from 'nestjs-zod'
import { CreatePostDto, PostDto, UpdatePostDto } from '@/lib/dtos/post'
import type { IPostController } from '@/lib/types/modules/post'
import { PostService } from './post.service'

@ApiBearerAuth()
@Controller('posts')
export class PostController implements IPostController {
  constructor(protected readonly service: PostService) {}

  @Get('feed')
  @ZodResponse({ type: [PostDto] })
  async getPublishedPosts(): Promise<PostModel[]> {
    return this.service.getPublishedPosts()
  }

  @Get('drafts')
  @ZodResponse({ type: [PostDto] })
  async getDraftPosts(): Promise<PostModel[]> {
    return this.service.getDraftPosts()
  }

  @Post()
  @ZodResponse({ type: PostDto })
  async createPost(@Body() postData: CreatePostDto): Promise<PostModel> {
    return this.service.createPost(postData as Prisma.PostCreateInput)
  }

  @Get(':uuid')
  @ZodResponse({ type: PostDto })
  async getPostByUuid(
    @Param('uuid', ParseUUIDPipe) uuid: string
  ): Promise<PostModel> {
    return this.service.getPostByUuid(uuid)
  }

  @Patch(':uuid')
  @ZodResponse({ type: PostDto })
  async updatePost(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() partialPostDto: UpdatePostDto
  ) {
    return this.service.updatePostByUuid(uuid, partialPostDto)
  }

  @Delete(':uuid')
  @ZodResponse({ type: PostDto })
  async deletePost(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.service.deletePostByUuid(uuid)
  }
}
