import { Test } from '@nestjs/testing'
import { PostController } from '@/modules/post/post.controller'
import { PostService } from '@/modules/post/post.service'
import { draftMockPosts } from '@/test/mock'
import { BadRequestException, NotFoundException } from '@nestjs/common'

describe('PostController.getPostByUuid', () => {
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
            getPostByUuid: jest.fn().mockResolvedValue(draftMockPosts[0]),
          },
        },
      ],
    }).compile()

    postController = moduleRef.get(PostController)
    postService = moduleRef.get(PostService)
    spy = jest.spyOn(postService, 'getPostByUuid')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call the service method correctly', async () => {
    await postController.getPostByUuid(draftMockPosts[0].uuid)
    expect(spy).toHaveBeenCalledWith(draftMockPosts[0].uuid)
  })

  it('should get the post related to uuid', async () => {
    const result = await postController.getPostByUuid(draftMockPosts[0].uuid)
    expect(result).toEqual(draftMockPosts[0])
  })

  it('should throw NotFoundException when post is not found', async () => {
    const message = 'Registro não encontrado'
    spy.mockRejectedValue(new NotFoundException(message))
    await expect(
      postController.getPostByUuid('123e4567-e89b-12d3-a456-426614175002')
    ).rejects.toThrow(message)
  })

  it('should throw BadRequestException when uuid is invalid', async () => {
    const message = 'Validation failed (uuid is expected)'
    spy.mockRejectedValue(new BadRequestException(message))
    await expect(postController.getPostByUuid('invalid-uuid')).rejects.toThrow(
      message
    )
  })

  it('should propagate service error', async () => {
    const message = 'Service error'
    spy.mockRejectedValue(new Error(message))
    await expect(
      postController.getPostByUuid(draftMockPosts[0].uuid)
    ).rejects.toThrow(message)
  })
})
