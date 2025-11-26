import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { postSchema } from '@/lib/dtos/post'
import { LoginReturnDto, loginReturnSchema } from '@/lib/dtos/auth'
import { CreatePostSchemaDto } from '@/lib/dtos/post'
import { postRoutes } from '@/test/mock'
import { createAuthenticatedApp } from '@/test/utils/setup'

describe('Module Post: POST Tests', () => {
  let app: INestApplication
  let jwtToken: string
  let loginPayload: LoginReturnDto
  let postData: CreatePostSchemaDto

  beforeAll(async () => {
    const context = await createAuthenticatedApp()

    app = context.app
    jwtToken = context.jwtToken
    loginPayload = context.loginPayload

    postData = {
      authorUuid: loginPayload.userUuid,
      title: 'Test Post Title',
      content: 'This is a test post content',
      published: true,
    }
  })

  describe('Authentication', () => {
    it('should be authenticated', () => {
      expect(loginReturnSchema.safeParse(loginPayload).success).toBe(true)
    })
  })

  describe('Success Cases', () => {
    it('should create a new post', async () => {
      await request(app.getHttpServer())
        .post(postRoutes.base)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(postData)
        .expect((res) => {
          const { body, statusCode } = res
          expect(postSchema.safeParse(body).success).toBe(true)
          expect(statusCode).toBe(201)
        })
    })
  })

  describe('Fail Cases', () => {
    it('should fail to create post without authentication', async () => {
      await request(app.getHttpServer())
        .post(postRoutes.base)
        .send(postData)
        .expect(401)
    })

    describe('Validation', () => {
      describe('Title', () => {
        it('should fail to create post with undefined title', async () => {
          const invalidData = { ...postData, title: undefined }

          await request(app.getHttpServer())
            .post(postRoutes.base)
            .set('Authorization', `Bearer ${jwtToken}`)
            .send(invalidData)
            .expect(400)
        })

        it('should fail to create post with a title type different from string', async () => {
          const invalidData = { ...postData, title: true }

          await request(app.getHttpServer())
            .post(postRoutes.base)
            .set('Authorization', `Bearer ${jwtToken}`)
            .send(invalidData)
            .expect(400)
        })

        it('should fail to create post with a title length > 30', async () => {
          const invalidData = {
            ...postData,
            title: 'To long title'.padEnd(31, '.'),
          }

          await request(app.getHttpServer())
            .post(postRoutes.base)
            .set('Authorization', `Bearer ${jwtToken}`)
            .send(invalidData)
            .expect(400)
        })

        it('should fail to create post with an empty title', async () => {
          const invalidData = { ...postData, title: ' ' }

          await request(app.getHttpServer())
            .post(postRoutes.base)
            .set('Authorization', `Bearer ${jwtToken}`)
            .send(invalidData)
            .expect(400)
        })
      })

      describe('Content', () => {
        it('should fail to create post with undefined content', async () => {
          const invalidData = { ...postData, content: undefined }

          await request(app.getHttpServer())
            .post(postRoutes.base)
            .set('Authorization', `Bearer ${jwtToken}`)
            .send(invalidData)
            .expect(400)
        })

        it('should fail to create post with a content type different from string', async () => {
          const invalidData = { ...postData, content: true }

          await request(app.getHttpServer())
            .post(postRoutes.base)
            .set('Authorization', `Bearer ${jwtToken}`)
            .send(invalidData)
            .expect(400)
        })

        it('should fail to create post with a content length > 100', async () => {
          const invalidData = {
            ...postData,
            content: 'To long title'.padEnd(101, '.'),
          }

          await request(app.getHttpServer())
            .post(postRoutes.base)
            .set('Authorization', `Bearer ${jwtToken}`)
            .send(invalidData)
            .expect(400)
        })

        it('should fail to create post with an empty content', async () => {
          const invalidData = { ...postData, content: ' ' }

          await request(app.getHttpServer())
            .post(postRoutes.base)
            .set('Authorization', `Bearer ${jwtToken}`)
            .send(invalidData)
            .expect(400)
        })
      })

      describe('Published', () => {
        it('should fail to create post with published type different from boolean', async () => {
          const invalidData = { ...postData, published: 'true' }

          await request(app.getHttpServer())
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
