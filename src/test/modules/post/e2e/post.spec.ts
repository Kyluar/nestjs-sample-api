import * as request from 'supertest'
import { z } from '@/lib/config/zod'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '../../../../app.module'
import { Express } from 'express'
import { Post } from '@prisma/client'
import { LoginReturnDto } from '@/lib/dtos/auth'
import { postSchema, createPostSchema } from '@/lib/dtos/post'

const postRoutes = {
  base: '/posts',
  feed: '/posts/feed',
  draft: '/posts/drafts',
}

const credentials = {
  email: 'gabriel@prisma.io',
  password: 'gabrielpassword',
}

const authorUuid: string = 'c98ce012-38bd-4934-9f96-8d2db34a4b7b'

describe('Post', () => {
  let app: INestApplication
  let jwtToken: string

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    await app.init()

    const loginResponse: { body: LoginReturnDto } = await request(
      app.getHttpServer() as Express
    )
      .post('/auth/login')
      .send(credentials)
      .expect(201)

    jwtToken = loginResponse.body.accessToken
  })

  describe('Authentication', () => {
    it('should be authenticated', () => {
      expect(jwtToken).toBeDefined()
    })
  })

  describe(`/GET ${postRoutes.feed}`, () => {
    it('should return an array of published posts', () => {
      return request(app.getHttpServer() as Express)
        .get(postRoutes.feed)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200)
        .expect((res) => {
          const posts = res.body as Post[]
          expect(
            posts.every((post) => postSchema.safeParse(post).success)
          ).toBe(true)
          expect(posts.every((post) => post.published)).toBe(true)
        })
    })
  })

  describe(`/GET ${postRoutes.draft}`, () => {
    it('should return an array of draft posts', () => {
      return request(app.getHttpServer() as Express)
        .get(postRoutes.draft)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200)
        .expect((res) => {
          const posts = res.body as Post[]
          expect(
            posts.every((post) => postSchema.safeParse(post).success)
          ).toBe(true)
          expect(posts.every((post) => !post.published)).toBe(true)
        })
    })
  })

  describe(`/POST ${postRoutes.base}`, () => {
    const newPostData: z.infer<typeof createPostSchema> = {
      authorUuid,
      title: 'Test Post Title',
      content: 'This is a test post content',
      published: true,
    }

    // it('should create a new post', () => {
    //   return request(app.getHttpServer() as Express)
    //     .post(postRoutes.base)
    //     .set('Authorization', `Bearer ${jwtToken}`)
    //     .send(newPostData)
    //     .expect(201)
    //     .expect((res) => {
    //       const post = res.body as Post
    //       expect(postSchema.safeParse(post).success).toBe(true)
    //     })
    // })

    describe('Fail Tests', () => {
      it('should fail to create post without authentication', () => {
        return request(app.getHttpServer() as Express)
          .post(postRoutes.base)
          .send(newPostData)
          .expect(401)
      })
    })

    describe('Data Request Validation', () => {
      describe('Title', () => {
        it('should fail to create post with undefined title', () => {
          const invalidData = {
            ...newPostData,
            title: undefined,
          }
          return request(app.getHttpServer() as Express)
            .post(postRoutes.base)
            .set('Authorization', `Bearer ${jwtToken}`)
            .send(invalidData)
            .expect(400)
        })

        it('should fail to create post with a title type different from string', () => {
          const invalidData = {
            ...newPostData,
            title: true,
          }
          return request(app.getHttpServer() as Express)
            .post(postRoutes.base)
            .set('Authorization', `Bearer ${jwtToken}`)
            .send(invalidData)
            .expect(400)
        })

        it('should fail to create post with a title length > 30', () => {
          const longTitle = 'To long title'.padEnd(31, '.')
          const invalidData = {
            ...newPostData,
            title: longTitle,
          }
          return request(app.getHttpServer() as Express)
            .post(postRoutes.base)
            .set('Authorization', `Bearer ${jwtToken}`)
            .send(invalidData)
            .expect(400)
        })

        it('should fail to create post with an empty title', () => {
          const invalidData = {
            ...newPostData,
            title: ' ',
          }
          return request(app.getHttpServer() as Express)
            .post(postRoutes.base)
            .set('Authorization', `Bearer ${jwtToken}`)
            .send(invalidData)
            .expect(400)
        })
      })

      describe('Content', () => {
        it('should fail to create post with undefined content', () => {
          const invalidData = {
            ...newPostData,
            content: undefined,
          }
          return request(app.getHttpServer() as Express)
            .post(postRoutes.base)
            .set('Authorization', `Bearer ${jwtToken}`)
            .send(invalidData)
            .expect(400)
        })
        it('should fail to create post with a content type different from string', () => {
          const invalidData = {
            ...newPostData,
            content: true,
          }
          return request(app.getHttpServer() as Express)
            .post(postRoutes.base)
            .set('Authorization', `Bearer ${jwtToken}`)
            .send(invalidData)
            .expect(400)
        })

        it('should fail to create post with a content length > 100', () => {
          const longContent = 'To long title'.padEnd(101, '.')
          const invalidData = {
            ...newPostData,
            content: longContent,
          }
          return request(app.getHttpServer() as Express)
            .post(postRoutes.base)
            .set('Authorization', `Bearer ${jwtToken}`)
            .send(invalidData)
            .expect(400)
        })

        it('should fail to create post with an empty content', () => {
          const invalidData = {
            ...newPostData,
            content: ' ',
          }
          return request(app.getHttpServer() as Express)
            .post(postRoutes.base)
            .set('Authorization', `Bearer ${jwtToken}`)
            .send(invalidData)
            .expect(400)
        })
      })

      describe('Published', () => {
        it('should fail to create post with undefined published', () => {
          const invalidData = {
            ...newPostData,
            published: undefined,
          }
          return request(app.getHttpServer() as Express)
            .post(postRoutes.base)
            .set('Authorization', `Bearer ${jwtToken}`)
            .send(invalidData)
            .expect(400)
        })
        it('should fail to create post with published type different from boolean', () => {
          const invalidData = {
            ...newPostData,
            published: 'true',
          }
          return request(app.getHttpServer() as Express)
            .post(postRoutes.base)
            .set('Authorization', `Bearer ${jwtToken}`)
            .send(invalidData)
            .expect(400)
        })
      })
    })
  })

  afterAll(async () => {
    await app.close()
  })
})
