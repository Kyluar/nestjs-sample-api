import * as request from 'supertest'
import { z } from '@/lib/config/zod'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '../../../../app.module'
import { Express } from 'express'
import { Post } from '@prisma/client'

import { postSchema } from '@/lib/dtos/post'
describe('Post', () => {
  const postResponseSchema = z
    .strictObject({
      ...postSchema.shape,
      uuid: z.uuid(),
      createdAt: z
        .instanceof(Date)
        .or(z.string().transform((str) => new Date(str))),
      updatedAt: z
        .instanceof(Date)
        .or(z.string().transform((str) => new Date(str))),
    })
    .required() satisfies z.ZodType<Post>

  const credentials = {
    email: 'gabriel@prisma.io',
    password: 'gabrielpassword',
  }
  let app: INestApplication
  let jwtToken: string

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    await app.init()
  })

  beforeEach(async () => {
    const loginResponse: { body: { accessToken: string } } = await request(
      app.getHttpServer() as Express
    )
      .post('/auth/login')
      .send(credentials)
      .expect(201)

    jwtToken = loginResponse.body.accessToken
  })

  describe(`/GET post/feed`, () => {
    it('should be authenticated', () => {
      expect(jwtToken).toBeDefined()
    })

    it('should return an array', () => {
      return request(app.getHttpServer() as Express)
        .get('/post/feed')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBeTruthy()
        })
    })

    it('should be an array of published Posts', () => {
      return request(app.getHttpServer() as Express)
        .get('/post/feed')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200)
        .expect((res) => {
          const posts = res.body as Post[]
          expect(
            posts.every((post) => postResponseSchema.safeParse(post).success)
          ).toBe(true)
          expect(posts.every((post) => post.published)).toBe(true)
        })
    })
  })

  afterAll(async () => {
    await app.close()
  })
})
