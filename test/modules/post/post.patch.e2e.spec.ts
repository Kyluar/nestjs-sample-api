import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Post } from '@prisma/client'
import { postSchema, CreatePostSchemaDto } from '@/lib/dtos/post'
import { postRoute } from '@/test/lib/routes'
import { setupTestEnvironment, teardownTestEnvironment } from '@/test/lib/utils'

describe('Module Post: E2E PATCH Tests', () => {
  let app: INestApplication
  let accessToken: string
  let existingPostUuid: string
  let patchPostData: Partial<CreatePostSchemaDto>

  beforeAll(async () => {
    const context = await setupTestEnvironment()

    app = context.app
    accessToken = context.loginPayload.accessToken

    existingPostUuid = (
      await request(app.getHttpServer())
        .get(postRoute.feed)
        .set('Authorization', `Bearer ${accessToken}`)
    ).body[0].uuid

    patchPostData = {
      title: 'Test Post Title (Patch)',
      content: 'This is a test post content (Patch)',
      published: false,
    }
  })

  describe(`Success cases`, () => {
    describe(`${postRoute.base}/uuid`, () => {
      it(`should update a post`, async () => {
        await request(app.getHttpServer())
          .patch(`${postRoute.base}/${existingPostUuid}`)
          .set('Authorization', `Bearer ${accessToken}`)
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
    describe(`${postRoute.base}/uuid`, () => {
      it(`should fail when not authenticated`, async () => {
        await request(app.getHttpServer())
          .patch(`${postRoute.base}/${existingPostUuid}`)
          .send(patchPostData)
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
          .send({ ...patchPostData, invalid: true })
          .expect(400)
      })
      it(`should fail when wrong uuid is passed`, async () => {
        await request(app.getHttpServer())
          .patch(`${postRoute.base}/wrongUuid`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(patchPostData)
          .expect(400)
      })
      it(`should fail when uuid is not associated with a post`, async () => {
        await request(app.getHttpServer())
          .patch(`${postRoute.base}/550e8400-e29b-41d4-a716-446655440000`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(patchPostData)
          .expect(404)
      })
    })
  })

  afterAll(async () => {
    await teardownTestEnvironment(app)
  })
})
