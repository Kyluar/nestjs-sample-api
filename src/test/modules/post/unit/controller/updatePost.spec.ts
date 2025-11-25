import { Test } from '@nestjs/testing'
import { PostController } from '@/modules/post/post.controller'
import { PostService } from '@/modules/post/post.service'
import { draftMockPosts } from 'src/test/mock'
import { BadRequestException, NotFoundException } from '@nestjs/common'
import { Post } from '@prisma/client'

const ERROR_MESSAGES = {
  NOT_FOUND: 'Registro não encontrado',
  INVALID_UUID: 'Validation failed (uuid is expected)',
  SERVICE_ERROR: 'Service error',
  UNMAPPED_FIELD: 'Testando:',
}

describe('PostController.updatePost', () => {
  let postController: PostController
  let postService: PostService
  let spy: jest.SpyInstance
  const post: Post = (draftMockPosts as Post[])[0]

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        {
          provide: PostService,
          useValue: {
            updatePostByUuid: jest.fn().mockResolvedValue(post),
          },
        },
      ],
    }).compile()

    postController = moduleRef.get(PostController)
    postService = moduleRef.get(PostService)
    spy = jest.spyOn(postService, 'updatePostByUuid')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('expected behavior', () => {
    it('should call the service method correctly', async () => {
      await postController.updatePost(post.uuid, post)
      expect(spy).toHaveBeenCalledWith(post.uuid, post)
    })

    it('should update the post related to uuid', async () => {
      const result = await postController.updatePost(post.uuid, post)
      expect(result).toEqual(post)
    })
  })

  describe('error handling', () => {
    it('should throw BadRequestException when sending unmapped fields', async () => {
      const message = ERROR_MESSAGES.UNMAPPED_FIELD + 'test'
      spy.mockRejectedValue(new BadRequestException(message))
      await expect(
        postController.updatePost(post.uuid, {
          ...post,
          test: 'unmapped field',
        })
      ).rejects.toThrow(message)
    })

    it('should throw NotFoundException when post is not found', async () => {
      spy.mockRejectedValue(new NotFoundException(ERROR_MESSAGES.NOT_FOUND))
      await expect(
        postController.updatePost('123e4567-e89b-12d3-a456-426614175002', post)
      ).rejects.toThrow(ERROR_MESSAGES.NOT_FOUND)
    })

    it('should throw BadRequestException when uuid is invalid', async () => {
      spy.mockRejectedValue(
        new BadRequestException(ERROR_MESSAGES.INVALID_UUID)
      )
      await expect(
        postController.updatePost('invalid-uuid', post)
      ).rejects.toThrow(ERROR_MESSAGES.INVALID_UUID)
    })

    it('should propagate service error', async () => {
      spy.mockRejectedValue(new Error(ERROR_MESSAGES.SERVICE_ERROR))
      await expect(postController.updatePost(post.uuid, post)).rejects.toThrow(
        ERROR_MESSAGES.SERVICE_ERROR
      )
    })
  })
})
