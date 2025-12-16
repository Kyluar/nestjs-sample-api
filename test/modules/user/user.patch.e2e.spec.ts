import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { User } from '@prisma/client'
import { UpdateUserDtoType, userResponseSchema } from '@/lib/dtos/user'
import { userRoute } from '@/test/lib/routes'
import { setupTestEnvironment, teardownTestEnvironment } from '@/test/lib/utils'

describe('Module User: E2E PATCH Tests', () => {
  let app: INestApplication
  let accessToken: string
  let existingUserUuid: string
  let patchUserData: UpdateUserDtoType

  beforeAll(async () => {
    const context = await setupTestEnvironment()

    app = context.app
    accessToken = context.loginPayload.accessToken
    existingUserUuid = context.loginPayload.userUuid

    patchUserData = {
      name: 'Updated User Name',
      email: 'updated@email.com',
    }
  })

  describe(`Success cases`, () => {
    describe(`${userRoute.base}/:uuid`, () => {
      it(`should update a user`, async () => {
        await request(app.getHttpServer())
          .patch(`${userRoute.base}/${existingUserUuid}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(patchUserData)
          .expect((res) => {
            const user = res.body as User
            expect(res.statusCode).toBe(200)
            expect(userResponseSchema.safeParse(user).success).toBe(true)
            expect(user.uuid).toBe(existingUserUuid)
            expect(
              Object.entries(patchUserData).every(([k, v]) => user[k] === v)
            ).toBe(true)
            expect(user.password).toBe(undefined)
          })
      })
    })
  })

  describe(`Fail cases`, () => {
    describe(`${userRoute.base}/:uuid`, () => {
      it(`should fail when not authenticated`, async () => {
        await request(app.getHttpServer())
          .patch(`${userRoute.base}/${existingUserUuid}`)
          .send(patchUserData)
          .expect(401)
      })

      it(`should fail when wrong uuid format is passed`, async () => {
        await request(app.getHttpServer())
          .patch(`${userRoute.base}/invalid-uuid-format`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(patchUserData)
          .expect(400)
      })

      it(`should fail when uuid does not exist`, async () => {
        await request(app.getHttpServer())
          .patch(`${userRoute.base}/550e8400-e29b-41d4-a716-446655440000`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(patchUserData)
          .expect(404)
      })

      it(`should fail with additional fields (strict validation)`, async () => {
        await request(app.getHttpServer())
          .patch(`${userRoute.base}/${existingUserUuid}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ ...patchUserData, password: 'securepassword123' })
          .expect(400)
      })

      it(`should fail to update a user with duplicated email`, async () => {
        const duplicatedEmail = 'already-taken@email.com'

        await request(app.getHttpServer())
          .post(userRoute.base)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: 'Existing User',
            email: duplicatedEmail,
            password: 'securePassword123',
          })
          .expect(201)

        await request(app.getHttpServer())
          .patch(`${userRoute.base}/${existingUserUuid}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ email: duplicatedEmail })
          .expect(409)
      })
    })
  })

  afterAll(async () => {
    await teardownTestEnvironment(app)
  })
})
