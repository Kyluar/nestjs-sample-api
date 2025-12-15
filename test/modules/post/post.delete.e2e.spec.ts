import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Post } from '@prisma/client'
import { postRoute } from '@/test/lib/routes'
import { postSchema } from '@/lib/dtos/post'
import { setupTestEnvironment, teardownTestEnvironment } from '@/test/lib/utils'

describe('Module Post: E2E DELETE Tests', () => {
  let app: INestApplication
  let accessToken: string
  let existingPostUuid: string
  let postToDeleteUuid: string

  beforeAll(async () => {
    const context = await setupTestEnvironment()

    app = context.app
    accessToken = context.loginPayload.accessToken
    existingPostUuid = (
      await request(app.getHttpServer())
        .get(postRoute.feed)
        .set('Authorization', `Bearer ${accessToken}`)
    ).body[0].uuid

    const postData = {
      authorUuid: context.loginPayload.userUuid,
      title: 'Post to Delete',
      content: 'This post will be deleted in the success case.',
      published: true,
    }

    const createResponse = await request(app.getHttpServer())
      .post(postRoute.base)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(postData)

    postToDeleteUuid = createResponse.body.uuid
  })

  describe(`Success cases`, () => {
    describe(`${postRoute.base}/:uuid`, () => {
      it(`should delete a post by uuid and return the deleted post`, async () => {
        await request(app.getHttpServer())
          .delete(`${postRoute.base}/${postToDeleteUuid}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect((res) => {
            const deletedPost = res.body as Post
            expect(res.statusCode).toBe(200)
            expect(postSchema.safeParse(deletedPost).success).toBe(true)
            expect(deletedPost.uuid).toBe(postToDeleteUuid)
          })

        await request(app.getHttpServer())
          .get(`${postRoute.base}/${postToDeleteUuid}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(404)
      })
    })
  })

  describe(`Fail cases`, () => {
    describe(`${postRoute.base}/:uuid`, () => {
      it(`should fail when not authenticated`, async () => {
        await request(app.getHttpServer())
          .delete(`${postRoute.base}/${existingPostUuid}`)
          .expect(401)
      })

      it(`should fail when wrong uuid is passed (invalid format)`, async () => {
        await request(app.getHttpServer())
          .delete(`${postRoute.base}/wrongUuidFormat`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(400)
      })

      it(`should fail when uuid is not associated with a post (not found)`, async () => {
        await request(app.getHttpServer())
          .delete(`${postRoute.base}/550e8400-e29b-41d4-a716-446655440000`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(404)
      })
    })
  })

  afterAll(async () => {
    await teardownTestEnvironment(app)
  })
})
