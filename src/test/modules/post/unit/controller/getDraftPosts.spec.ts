import { Test } from '@nestjs/testing'
import { PostController } from '@/modules/post/post.controller'
import { PostService } from '@/modules/post/post.service'
import { draftMockPosts } from 'src/test/mock/post.mock'
import type { Post } from '@prisma/client'

describe('PostController.getDraftPosts', () => {
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
            getDraftPosts: jest
              .fn()
              .mockResolvedValue(draftMockPosts as Post[]),
          },
        },
      ],
    }).compile()

    postController = moduleRef.get(PostController)
    postService = moduleRef.get(PostService)
    spy = jest.spyOn(postService, 'getDraftPosts')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call the service method correctly', async () => {
    await postController.getDraftPosts()
    expect(spy).toHaveBeenCalled()
  })

  it('should return an array of draft posts', async () => {
    const result = await postController.getDraftPosts()

    expect(result).toEqual(draftMockPosts)
    expect(result.every((post) => !post.published)).toBe(true)
  })

  it('should handle empty array from service', async () => {
    spy.mockResolvedValue([])
    const result = await postController.getDraftPosts()

    expect(result).toEqual([])
  })

  it('should propagate service error', async () => {
    spy.mockRejectedValue(new Error('Service error'))

    await expect(postController.getDraftPosts()).rejects.toThrow(
      'Service error'
    )
  })
})
