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
import { PostsService } from './post.service'
import { Post as PostModel, Prisma } from '@prisma/client'
import { PostDto, PartialPostDto } from '@/lib/dtos/post'

@Controller('post')
export class PostController {
  constructor(protected readonly service: PostsService) {}

  @Get('feed')
  async getPublishedPosts(): Promise<PostModel[]> {
    return this.service.posts({
      where: { published: true },
    })
  }

  @Get('drafts')
  async getDraftPosts(): Promise<PostModel[]> {
    return this.service.posts({
      where: { published: false },
    })
  }

  @Post()
  async createPost(@Body() postData: PostDto): Promise<PostModel> {
    return this.service.createPost(postData as Prisma.PostCreateInput)
  }

  @Get(':uuid')
  async getPostByUuid(
    @Param('uuid', ParseUUIDPipe) uuid: string
  ): Promise<PostModel | null> {
    return this.service.post({ uuid })
  }

  @Patch(':uuid')
  async updatePost(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() partialPostDto: PartialPostDto
  ) {
    return this.service.updatePost({
      where: { uuid },
      data: partialPostDto,
    })
  }

  @Delete(':uuid')
  async deletePost(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.service.deletePost({ uuid })
  }

  // @Post()
  // create(@Body() body: CreatePostDto) {
  //   return this.service.create(body as unknown as PostType)
  // }

  // @Put(':uuid')
  // update(@Param('uuid') uuid: string, @Body() body: UpdatePostDto) {
  //   return this.service.update(uuid, body as unknown as PostType)
  // }

  // @Patch(':uuid')
  // patch(@Param('uuid') uuid: string, @Body() body: UpdatePostDto) {
  //   return this.service.patch(uuid, body as unknown as PostType)
  // }

  // @Get(':userUuid')
  // getByUserUuid(@Param('userUuid') userUuid: string) {
  //   return this.service.getByUserUuid(userUuid)
  // }
}
