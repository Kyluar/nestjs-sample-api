import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { postSchema } from '@/lib/dtos/post'
import { CreatePostSchemaDto } from '@/lib/dtos/post'
import { postRoutes } from '@/test/mock'
import { setupTestEnvironment, teardownTestEnvironment } from '@/test/utils'

describe('Module Post: POST Tests', () => {
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
        .post(postRoutes.base)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(postData)
        .expect((res) => {
          const post = res.body
          expect(postSchema.safeParse(post).success).toBe(true)
          expect(201)
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

    it('should fail to create post without fields', async () => {
      await request(app.getHttpServer())
        .post(postRoutes.base)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400)
    })

    it('should fail to create post with addicional fields', async () => {
      await request(app.getHttpServer())
        .post(postRoutes.base)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ...postData, invalid: true })
        .expect(400)
    })

    it('should fail to create post with required fields missing', async () => {
      const { title, authorUuid, ...incompletePostData } = postData
      await request(app.getHttpServer())
        .post(postRoutes.base)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(incompletePostData)
        .expect(400)
    })

    describe('Validation', () => {
      describe('Author Uuid', () => {
        it('should fail to create post whose authorUuid is undefined', async () => {
          const invalidData = { ...postData, authorUuid: undefined }

          await request(app.getHttpServer())
            .post(postRoutes.base)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(invalidData)
            .expect(400)
        })
        it('should fail to create a post whose authorUuid is not an uuid', async () => {
          const invalidData = { ...postData, authorUuid: '999.999.999-99' }

          await request(app.getHttpServer())
            .post(postRoutes.base)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(invalidData)
            .expect(400)
        })

        it('should fail to create post whose authorUuid is not a string', async () => {
          const invalidData = { ...postData, authorUuid: true }

          await request(app.getHttpServer())
            .post(postRoutes.base)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(invalidData)
            .expect(400)
        })

        it('should fail to create post whose authorUuid is an empty string', async () => {
          const invalidData = { ...postData, authorUuid: ' ' }

          await request(app.getHttpServer())
            .post(postRoutes.base)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(invalidData)
            .expect(400)
        })
      })

      describe('Title', () => {
        it('should fail to create post with undefined title', async () => {
          const invalidData = { ...postData, title: undefined }

          await request(app.getHttpServer())
            .post(postRoutes.base)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(invalidData)
            .expect(400)
        })

        it('should fail to create post with a title type different from string', async () => {
          const invalidData = { ...postData, title: true }

          await request(app.getHttpServer())
            .post(postRoutes.base)
            .set('Authorization', `Bearer ${accessToken}`)
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
            .set('Authorization', `Bearer ${accessToken}`)
            .send(invalidData)
            .expect(400)
        })

        it('should fail to create post with an empty title', async () => {
          const invalidData = { ...postData, title: ' ' }

          await request(app.getHttpServer())
            .post(postRoutes.base)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(invalidData)
            .expect(400)
        })
      })

      describe('Content', () => {
        it('should fail to create post with undefined content', async () => {
          const invalidData = { ...postData, content: undefined }

          await request(app.getHttpServer())
            .post(postRoutes.base)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(invalidData)
            .expect(400)
        })

        it('should fail to create post with a content type different from string', async () => {
          const invalidData = { ...postData, content: true }

          await request(app.getHttpServer())
            .post(postRoutes.base)
            .set('Authorization', `Bearer ${accessToken}`)
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
            .set('Authorization', `Bearer ${accessToken}`)
            .send(invalidData)
            .expect(400)
        })

        it('should fail to create post with an empty content', async () => {
          const invalidData = { ...postData, content: ' ' }

          await request(app.getHttpServer())
            .post(postRoutes.base)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(invalidData)
            .expect(400)
        })
      })

      describe('Published', () => {
        it('should fail to create post with published type different from boolean', async () => {
          const invalidData = { ...postData, published: 'true' }

          await request(app.getHttpServer())
            .post(postRoutes.base)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(invalidData)
            .expect(400)
        })
      })
    })
  })

  afterAll(async () => {
    await teardownTestEnvironment(app)
  })
})
