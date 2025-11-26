import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Post } from '@prisma/client'
import { LoginReturnDto, loginReturnSchema } from '@/lib/dtos/auth'
import { postSchema } from '@/lib/dtos/post'
import { postRoutes } from '@/test/mock'
import { createAuthenticatedApp } from '@/test/utils/setup'

describe('Module Post: GET Tests', () => {
  let app: INestApplication
  let jwtToken: string
  let loginPayload: LoginReturnDto

  beforeAll(async () => {
    const context = await createAuthenticatedApp()

    app = context.app
    jwtToken = context.jwtToken
    loginPayload = context.loginPayload
  })

  describe('Authentication', () => {
    it('should be authenticated', () => {
      expect(loginReturnSchema.safeParse(loginPayload).success).toBe(true)
    })
  })

  describe(`Success cases`, () => {
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
    await app.close()
  })
})
