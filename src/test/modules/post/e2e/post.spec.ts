import * as request from 'supertest'
import { z } from '@/lib/config/zod'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AppModule } from '../../../../app.module'
import { Express } from 'express'
import { Post } from '@prisma/client'
import { LoginReturnDto } from '@/lib/dtos/auth'
import { postSchema, createPostSchema } from '@/lib/dtos/post'
import {
  requestTest,
  requestDataValidationTest,
  requestGetTest,
} from '@/test/utils/request.test.utils'
import {
  RequestDataValidationTestParams,
  GetRequestTestParams,
} from '@/test/types/request.test.types.utils'
import { TestConfigSchemaOutput } from '@/lib/dtos/config/config.dto'

const postRoutes = {
  base: '/posts',
  feed: '/posts/feed',
  draft: '/posts/drafts',
}

describe('Post', () => {
  let app: INestApplication
  let jwtToken: string
  let authorUuid: string
  let configService: ConfigService

  const postGetRequest = (
    params: Omit<GetRequestTestParams, 'getApp' | 'getJwtToken'>
  ) => {
    return requestGetTest({
      ...params,
      getApp: () => app,
      getJwtToken: () => jwtToken,
    })
  }

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    configService = app.get<ConfigService>(ConfigService)
    await app.init()

    const credentials = configService.get<TestConfigSchemaOutput>('test')

    const loginResponse: { body: LoginReturnDto } = await request(
      app.getHttpServer() as Express
    )
      .post('/auth/login')
      .send(credentials)

    jwtToken = loginResponse.body.accessToken
    authorUuid = loginResponse.body.userUuid
  })

  describe('Authentication', () => {
    it('should be authenticated', () => {
      expect(jwtToken).toBeDefined()
    })
  })

  describe(`/GET ${postRoutes.feed}`, () => {
    postGetRequest({
      name: 'should return an array of published posts',
      url: postRoutes.feed,
      resCallback: (res) => {
        const posts = res.body as Post[]
        expect(posts.every((post) => postSchema.safeParse(post).success)).toBe(
          true
        )
        expect(posts.every((post) => post.published)).toBe(true)
      },
    })
  })

  describe(`/GET ${postRoutes.draft}`, () => {
    postGetRequest({
      name: 'should return an array of draft posts',
      url: postRoutes.draft,
      resCallback: (res) => {
        const posts = res.body as Post[]
        expect(posts.every((post) => postSchema.safeParse(post).success)).toBe(
          true
        )
        expect(posts.every((post) => !post.published)).toBe(true)
      },
    })
  })

  describe(`/POST ${postRoutes.base}`, () => {
    const newPostData: z.infer<typeof createPostSchema> = {
      authorUuid,
      title: 'Test Post Title',
      content: 'This is a test post content',
      published: true,
    }

    const requestPostTest = (
      params: Omit<
        RequestDataValidationTestParams<z.infer<typeof createPostSchema>>,
        'requestData' | 'getApp' | 'getJwtToken' | 'url'
      >
    ) => {
      return requestDataValidationTest({
        ...params,
        getApp: () => app,
        getJwtToken: () => jwtToken,
        requestData: newPostData,
        url: postRoutes.base,
      })
    }

    // requestTest({
    //   getApp: () => app,
    //   method: 'POST',
    //   getJwtToken: () => jwtToken,
    //   resCallback: (res) => {
    //     const post = res.body as Post
    //     expect(postSchema.safeParse(post).success).toBe(true)
    //   },
    //   name: 'should create a new post',
    //   requestData: newPostData,
    //   url: postRoutes.base,
    //   status: 201,
    // })

    describe('Fail Tests', () => {
      requestTest({
        getApp: () => app,
        method: 'POST',
        name: 'should fail to create post without authentication',
        requestData: newPostData,
        url: postRoutes.base,
        status: 401,
      })

      describe('Validation', () => {
        describe('Title', () => {
          requestPostTest({
            name: 'should fail to create post with undefined title',
            invalidData: { title: undefined },
          })

          requestPostTest({
            name: 'should fail to create post with a title type different from string',
            invalidData: { title: true },
          })

          requestPostTest({
            name: 'should fail to create post with a title length > 30',
            invalidData: { title: 'To long title'.padEnd(31, '.') },
          })

          requestPostTest({
            name: 'should fail to create post with an empty title',
            invalidData: { title: ' ' },
          })
        })

        describe('Content', () => {
          requestPostTest({
            name: 'should fail to create post with undefined content',
            invalidData: { content: undefined },
          })
          requestPostTest({
            name: 'should fail to create post with a content type different from string',
            invalidData: { content: true },
          })

          requestPostTest({
            name: 'should fail to create post with a content length > 100',
            invalidData: { content: 'To long title'.padEnd(101, '.') },
          })

          requestPostTest({
            name: 'should fail to create post with an empty content',
            invalidData: { content: ' ' },
          })
        })

        describe('Published', () => {
          requestPostTest({
            name: 'should fail to create post with published type different from boolean',
            invalidData: { published: 'true' },
          })
        })
      })
    })
  })

  afterAll(async () => {
    await app.close()
  })
})
