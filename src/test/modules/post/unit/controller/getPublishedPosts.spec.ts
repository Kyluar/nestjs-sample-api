import { Test } from '@nestjs/testing'
import { PostController } from '@/modules/post/post.controller'
import { PostService } from '@/modules/post/post.service'
import { publishedMockPosts } from '@/test/mock/post.mock'

describe('PostController.getPublishedPosts', () => {
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
            getPublishedPosts: jest.fn().mockResolvedValue(publishedMockPosts),
          },
        },
      ],
    }).compile()

    postController = moduleRef.get(PostController)
    postService = moduleRef.get(PostService)
    spy = jest.spyOn(postService, 'getPublishedPosts')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call the service method correctly', async () => {
    await postController.getPublishedPosts()
    expect(spy).toHaveBeenCalled()
  })

  it('should return an array of published posts', async () => {
    const result = await postController.getPublishedPosts()

    expect(result).toEqual(publishedMockPosts)
    expect(result.every((post) => post.published)).toBe(true)
  })

  it('should handle empty array from service', async () => {
    spy.mockResolvedValue([])
    const result = await postController.getPublishedPosts()

    expect(result).toEqual([])
  })

  it('should propagate service error', async () => {
    spy.mockRejectedValue(new Error('Service error'))

    await expect(postController.getPublishedPosts()).rejects.toThrow(
      'Service error'
    )
  })
})
