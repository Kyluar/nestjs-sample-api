import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { User } from '@prisma/client'
import { userRoute } from '@/test/lib/routes'
import { userResponseSchema } from '@/lib/dtos/user'
import { setupTestEnvironment, teardownTestEnvironment } from '@/test/lib/utils'

describe('Module User: E2E GET Tests', () => {
  let app: INestApplication
  let accessToken: string
  let existingUserUuid: string

  beforeAll(async () => {
    const context = await setupTestEnvironment()

    app = context.app
    accessToken = context.loginPayload.accessToken
    existingUserUuid = context.loginPayload.userUuid
  })

  describe(`Success cases`, () => {
    describe(`${userRoute.base}/:uuid`, () => {
      it(`should return a user by their uuid`, async () => {
        await request(app.getHttpServer())
          .get(`${userRoute.base}/${existingUserUuid}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect((res) => {
            const user = res.body as User
            expect(res.statusCode).toBe(200)
            expect(userResponseSchema.safeParse(user).success).toBe(true)
            expect(user.uuid).toBe(existingUserUuid)
          })
      })
    })

    describe(`${userRoute.base}`, () => {
      it(`should return an array of all users`, async () => {
        await request(app.getHttpServer())
          .get(userRoute.base)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect((res) => {
            const users = res.body as User[]
            expect(res.statusCode).toBe(200)
            expect(Array.isArray(users)).toBe(true)
            expect(
              users.every((user) => userResponseSchema.safeParse(user).success)
            ).toBe(true)
          })
      })
    })
  })

  describe(`Fail cases`, () => {
    describe(`${userRoute.base}/:uuid`, () => {
      it(`should fail when not authenticated`, async () => {
        await request(app.getHttpServer())
          .get(`${userRoute.base}/${existingUserUuid}`)
          .expect(401)
      })

      it(`should fail when wrong uuid is passed (invalid format)`, async () => {
        await request(app.getHttpServer())
          .get(`${userRoute.base}/wrongUuidFormat`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(400)
      })

      it(`should fail when uuid is not associated with a user (not found)`, async () => {
        await request(app.getHttpServer())
          .get(`${userRoute.base}/550e8400-e29b-41d4-a716-446655440000`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(404)
      })
    })

    describe(`${userRoute.base}`, () => {
      it(`should fail when not authenticated`, async () => {
        await request(app.getHttpServer()).get(userRoute.base).expect(401)
      })
    })
  })

  afterAll(async () => {
    await teardownTestEnvironment(app)
  })
})
