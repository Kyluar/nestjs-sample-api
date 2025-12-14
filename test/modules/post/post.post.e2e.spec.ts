import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { postSchema } from '@/lib/dtos/post'
import { CreatePostSchemaDto } from '@/lib/dtos/post'
import { postRoute } from '@/test/lib/routes'
import { setupTestEnvironment, teardownTestEnvironment } from '@/test/lib/utils'
import { Post } from '@prisma/client'

describe('Module Post: E2E POST Tests', () => {
  let app: INestApplication
  let accessToken: string
  let userUuid: string
  let postData: CreatePostSchemaDto

  beforeAll(async () => {
    const context = await setupTestEnvironment()

    app = context.app
    accessToken = context.loginPayload.accessToken
    userUuid = context.loginPayload.userUuid

    postData = {
      authorUuid: userUuid,
      title: 'Test Post Title',
      content: 'This is a test post content',
      published: true,
    }
  })

  describe('Success Cases', () => {
    it('should create a new post', async () => {
      await request(app.getHttpServer())
        .post(postRoute.base)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(postData)
        .expect((res) => {
          const post = res.body as Post
          expect(postSchema.safeParse(post).success).toBe(true)
          expect(
            Object.entries(postData).every(([k, v]) => post[k] === v)
          ).toBe(true)
          expect(201)
        })
    })
  })

  describe('Fail Cases', () => {
    it('should fail to create post without authentication', async () => {
      await request(app.getHttpServer())
        .post(postRoute.base)
        .send(postData)
        .expect(401)
    })

    it('should fail to create post without fields', async () => {
      await request(app.getHttpServer())
        .post(postRoute.base)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400)
    })

    it('should fail to create post with addicional fields', async () => {
      await request(app.getHttpServer())
        .post(postRoute.base)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ...postData, invalid: true })
        .expect(400)
    })

    it('should fail to create post with required fields missing', async () => {
      const { title, authorUuid, ...incompletePostData } = postData
      await request(app.getHttpServer())
        .post(postRoute.base)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(incompletePostData)
        .expect(400)
    })
  })

  afterAll(async () => {
    await teardownTestEnvironment(app)
  })
})
