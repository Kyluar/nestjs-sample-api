import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Post } from '@prisma/client'
import { postSchema, CreatePostSchemaDto } from '@/lib/dtos/post'
import { postRoutes } from '@/test/mock'
import { setupTestEnvironment, teardownTestEnvironment } from '@/test/utils'

describe('Module Post: PATCH Tests', () => {
  let app: INestApplication
  let jwtToken: string
  let existingPostUuid: string
  let patchPostData: Partial<CreatePostSchemaDto>

  beforeAll(async () => {
    const context = await setupTestEnvironment()

    app = context.app
    jwtToken = context.loginPayload.accessToken

    existingPostUuid = (
      await request(app.getHttpServer())
        .get(postRoutes.feed)
        .set('Authorization', `Bearer ${jwtToken}`)
    ).body[0].uuid

    patchPostData = {
      title: 'Test Post Title (Patch)',
      content: 'This is a test post content (Patch)',
      published: false,
    }
  })

  describe(`Success cases`, () => {
    describe(`${postRoutes.base}/uuid`, () => {
      it(`should update a post`, async () => {
        await request(app.getHttpServer())
          .patch(`${postRoutes.base}/${existingPostUuid}`)
          .set('Authorization', `Bearer ${jwtToken}`)
          .send(patchPostData)
          .expect((res) => {
            const post = res.body as Post
            expect(postSchema.safeParse(post).success).toBe(true)
            expect(
              Object.entries(patchPostData).every(([k, v]) => post[k] === v)
            ).toBe(true)
            expect(res.statusCode).toBe(200)
          })
      })
    })
  })

  describe(`Fail cases`, () => {
    describe(`${postRoutes.base}/uuid`, () => {
      it(`should fail when not authenticated`, async () => {
        await request(app.getHttpServer())
          .patch(`${postRoutes.base}/${existingPostUuid}`)
          .send(patchPostData)
          .expect(401)
      })
      it(`should fail when no uuid is passed`, async () => {
        await request(app.getHttpServer())
          .patch(`${postRoutes.base}/wrongUuid`)
          .set('Authorization', `Bearer ${jwtToken}`)
          .send(patchPostData)
          .expect(400)
      })
      it(`should fail when uuid is not associated with a post`, async () => {
        await request(app.getHttpServer())
          .patch(`${postRoutes.base}/550e8400-e29b-41d4-a716-446655440000`)
          .set('Authorization', `Bearer ${jwtToken}`)
          .send(patchPostData)
          .expect(404)
      })
    })
  })

  afterAll(async () => {
    await teardownTestEnvironment(app)
  })
})
