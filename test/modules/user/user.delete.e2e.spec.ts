import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { User } from '@prisma/client'
import { userResponseSchema } from '@/lib/dtos/user'
import { userRoute } from '@/test/lib/routes'
import { setupTestEnvironment, teardownTestEnvironment } from '@/test/lib/utils'

describe('Module User: E2E DELETE Tests', () => {
  let app: INestApplication
  let accessToken: string
  let existingUserUuid: string
  let userToDeleteUuid: string

  beforeAll(async () => {
    const context = await setupTestEnvironment()

    app = context.app
    accessToken = context.loginPayload.accessToken
    existingUserUuid = context.loginPayload.userUuid

    const userData = {
      name: 'User to Delete',
      email: `todelete-${Date.now()}@example.com`,
      password: 'somePassword123',
    }

    const createResponse = await request(app.getHttpServer())
      .post(userRoute.base)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(userData)
      .expect(201)

    userToDeleteUuid = createResponse.body.uuid
  })

  describe(`Success cases`, () => {
    describe(`${userRoute.base}/:uuid`, () => {
      it(`should delete a user by uuid and return the deleted user`, async () => {
        await request(app.getHttpServer())
          .delete(`${userRoute.base}/${userToDeleteUuid}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect((res) => {
            const deletedUser = res.body as User
            expect(res.statusCode).toBe(200)
            expect(userResponseSchema.safeParse(deletedUser).success).toBe(true)
            expect(deletedUser.uuid).toBe(userToDeleteUuid)
            expect(deletedUser.password).toBeUndefined()
          })

        await request(app.getHttpServer())
          .get(`${userRoute.base}/${userToDeleteUuid}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(404)
      })
    })
  })

  describe(`Fail cases`, () => {
    describe(`${userRoute.base}/:uuid`, () => {
      it(`should fail when not authenticated`, async () => {
        await request(app.getHttpServer())
          .delete(`${userRoute.base}/${existingUserUuid}`)
          .expect(401)
      })

      it(`should fail when wrong uuid is passed (invalid format)`, async () => {
        await request(app.getHttpServer())
          .delete(`${userRoute.base}/wrongUuidFormat`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(400)
      })

      it(`should fail when uuid is not associated with a user (not found)`, async () => {
        await request(app.getHttpServer())
          .delete(`${userRoute.base}/550e8400-e29b-41d4-a716-446655440000`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(404)
      })
    })
  })

  afterAll(async () => {
    await teardownTestEnvironment(app)
  })
})
