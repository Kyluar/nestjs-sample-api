import {
  Controller,
  Body,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common'
import { PostService } from './post.service'
import { Post as PostModel, Prisma } from '@prisma/client'
import { PostDto, PartialPostDto } from '@/lib/dtos/post'
import { ApiBearerAuth } from '@nestjs/swagger'
import { IPostController } from '@/lib/types/modules/post'

@ApiBearerAuth()
@Controller('post')
export class PostController implements IPostController {
  constructor(protected readonly service: PostService) {}

  @Get('feed')
  async getPublishedPosts(): Promise<PostModel[]> {
    return this.service.getPublishedPosts()
  }

  @Get('drafts')
  async getDraftPosts(): Promise<PostModel[]> {
    return this.service.getDraftPosts()
  }

  @Post()
  async createPost(@Body() postData: PostDto): Promise<PostModel> {
    return this.service.createPost(postData as Prisma.PostCreateInput)
  }

  @Get(':uuid')
  async getPostByUuid(
    @Param('uuid', ParseUUIDPipe) uuid: string
  ): Promise<PostModel> {
    return this.service.getPostByUuid(uuid)
  }

  @Patch(':uuid')
  async updatePost(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() partialPostDto: PartialPostDto
  ) {
    return this.service.updatePostByUuid(uuid, partialPostDto)
  }

  @Delete(':uuid')
  async deletePost(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.service.deletePostByUuid(uuid)
  }
}
