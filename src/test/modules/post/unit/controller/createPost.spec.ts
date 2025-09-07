import { Test } from '@nestjs/testing'
import { PostController } from '@/modules/post/post.controller'
import { PostService } from '@/modules/post/post.service'
import { CreatePostDto } from '@/lib/dtos/post'
import { createPostData } from '@/test/mock'

describe('PostController.createPost', () => {
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
            createPost: jest.fn().mockResolvedValue(createPostData),
          },
        },
      ],
    }).compile()

    postController = moduleRef.get(PostController)
    postService = moduleRef.get(PostService)
    spy = jest.spyOn(postService, 'createPost')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call the service method correctly', async () => {
    await postController.createPost(createPostData as CreatePostDto)
    expect(spy).toHaveBeenCalledWith(createPostData)
  })

  it('should return the post created', async () => {
    const result = await postController.createPost(
      createPostData as CreatePostDto
    )
    expect(result).toEqual(createPostData)
  })

  it('should propagate service error', async () => {
    spy.mockRejectedValue(new Error('Service error'))

    await expect(
      postController.createPost(createPostData as CreatePostDto)
    ).rejects.toThrow('Service error')
  })
})
