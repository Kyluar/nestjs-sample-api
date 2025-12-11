import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Post } from '@prisma/client'
import { postSchema } from '@/lib/dtos/post'
import { postRoutes } from '@/test/mock'
import { setupTestEnvironment, teardownTestEnvironment } from '@/test/utils'

describe('Module Post: GET Tests', () => {
  let app: INestApplication
  let jwtToken: string
  let existingPostUuid: string

  beforeAll(async () => {
    const context = await setupTestEnvironment()

    app = context.app
    jwtToken = context.loginPayload.accessToken

    existingPostUuid = (
      await request(app.getHttpServer())
        .get(postRoutes.feed)
        .set('Authorization', `Bearer ${jwtToken}`)
    ).body[0].uuid
  })

  describe(`Success cases`, () => {
    describe(`${postRoutes.base}/uuid`, () => {
      it(`should return an array by your uuid`, async () => {
        await request(app.getHttpServer())
          .get(`${postRoutes.base}/${existingPostUuid}`)
          .set('Authorization', `Bearer ${jwtToken}`)
          .expect((res) => {
            const post = res.body as Post
            expect(postSchema.safeParse(post).success).toBe(true)
            expect(res.statusCode).toBe(200)
          })
      })
    })
    describe(`${postRoutes.feed}`, () => {
      it(`should return an array of published posts`, async () => {
        await request(app.getHttpServer())
          .get(postRoutes.feed)
          .set('Authorization', `Bearer ${jwtToken}`)
          .expect((res) => {
            const posts = res.body as Post[]
            expect(
              posts.every((post) => postSchema.safeParse(post).success)
            ).toBe(true)
            expect(posts.every((post) => post.published)).toBe(true)
            expect(res.statusCode).toBe(200)
          })
      })
    })
    describe(`${postRoutes.draft}`, () => {
      it(`should return an array of draft posts`, async () => {
        await request(app.getHttpServer())
          .get(postRoutes.draft)
          .set('Authorization', `Bearer ${jwtToken}`)
          .expect((res) => {
            const posts = res.body as Post[]
            expect(
              posts.every((post) => postSchema.safeParse(post).success)
            ).toBe(true)
            expect(posts.every((post) => !post.published)).toBe(true)
            expect(res.statusCode).toBe(200)
          })
      })
    })
  })

  describe(`Fail cases`, () => {
    describe(`${postRoutes.base}/uuid`, () => {
      it(`should fail when not authenticated`, async () => {
        await request(app.getHttpServer())
          .get(`${postRoutes.base}/${existingPostUuid}`)
          .expect(401)
      })
      it(`should fail when no uuid is passed`, async () => {
        await request(app.getHttpServer())
          .get(`${postRoutes.base}/wrongUuid`)
          .set('Authorization', `Bearer ${jwtToken}`)
          .expect(400)
      })
      it(`should fail when uuid is not associated with a post`, async () => {
        await request(app.getHttpServer())
          .get(`${postRoutes.base}/550e8400-e29b-41d4-a716-446655440000`)
          .set('Authorization', `Bearer ${jwtToken}`)
          .expect(404)
      })
    })
    describe(`${postRoutes.feed}`, () => {
      it(`should fail when not authenticated`, async () => {
        await request(app.getHttpServer()).get(postRoutes.feed).expect(401)
      })
    })
    describe(`${postRoutes.draft}`, () => {
      it(`should fail when not authenticated`, async () => {
        await request(app.getHttpServer()).get(postRoutes.draft).expect(401)
      })
    })
  })

  afterAll(async () => {
    await teardownTestEnvironment(app)
  })
})
