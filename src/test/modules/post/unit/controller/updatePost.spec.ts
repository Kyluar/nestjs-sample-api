import { Test } from '@nestjs/testing'
import { PostController } from '@/modules/post/post.controller'
import { PostService } from '@/modules/post/post.service'
import { draftMockPosts } from '@/test/mock'
import { BadRequestException, NotFoundException } from '@nestjs/common'

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

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        {
          provide: PostService,
          useValue: {
            updatePostByUuid: jest.fn().mockResolvedValue(draftMockPosts[0]),
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
      await postController.updatePost(draftMockPosts[0].uuid, draftMockPosts[0])
      expect(spy).toHaveBeenCalledWith(
        draftMockPosts[0].uuid,
        draftMockPosts[0]
      )
    })

    it('should update the post related to uuid', async () => {
      const result = await postController.updatePost(
        draftMockPosts[0].uuid,
        draftMockPosts[0]
      )
      expect(result).toEqual(draftMockPosts[0])
    })
  })

  describe('error handling', () => {
    it('should throw BadRequestException when sending unmapped fields', async () => {
      const message = ERROR_MESSAGES.UNMAPPED_FIELD + 'test'
      spy.mockRejectedValue(new BadRequestException(message))
      await expect(
        postController.updatePost(draftMockPosts[0].uuid, {
          ...draftMockPosts[0],
          test: 'unmapped field',
        })
      ).rejects.toThrow(message)
    })

    it('should throw NotFoundException when post is not found', async () => {
      spy.mockRejectedValue(new NotFoundException(ERROR_MESSAGES.NOT_FOUND))
      await expect(
        postController.updatePost(
          '123e4567-e89b-12d3-a456-426614175002',
          draftMockPosts[0]
        )
      ).rejects.toThrow(ERROR_MESSAGES.NOT_FOUND)
    })

    it('should throw BadRequestException when uuid is invalid', async () => {
      spy.mockRejectedValue(
        new BadRequestException(ERROR_MESSAGES.INVALID_UUID)
      )
      await expect(
        postController.updatePost('invalid-uuid', draftMockPosts[0])
      ).rejects.toThrow(ERROR_MESSAGES.INVALID_UUID)
    })

    it('should propagate service error', async () => {
      spy.mockRejectedValue(new Error(ERROR_MESSAGES.SERVICE_ERROR))
      await expect(
        postController.updatePost(draftMockPosts[0].uuid, draftMockPosts[0])
      ).rejects.toThrow(ERROR_MESSAGES.SERVICE_ERROR)
    })
  })
})
