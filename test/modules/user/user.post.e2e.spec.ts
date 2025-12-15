import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { User } from '@prisma/client'
import { CreateUserDtoType, userResponseSchema } from '@/lib/dtos/user'
import { setupTestEnvironment, teardownTestEnvironment } from '@/test/lib/utils'
import { userRoute } from '@/test/lib/routes'

describe('Module User: E2E POST Tests', () => {
  let app: INestApplication
  let accessToken: string
  let validUserData: CreateUserDtoType
  let duplicatedEmail: string

  beforeAll(async () => {
    const context = await setupTestEnvironment()
    app = context.app
    accessToken = context.loginPayload.accessToken
    duplicatedEmail = `existing-${Date.now()}@example.com`

    await request(app.getHttpServer())
      .post(userRoute.base)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Existing User',
        email: duplicatedEmail,
        password: 'securePassword123',
      })
      .expect(201)
  })

  beforeEach(() => {
    validUserData = {
      name: 'Test User',
      email: `test-${Date.now()}@example.com`,
      password: 'strongPassword456',
    }
  })

  describe('Success Cases', () => {
    it('should create a new user and return 201 (Created)', async () => {
      await request(app.getHttpServer())
        .post(userRoute.base)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(validUserData)
        .expect((res) => {
          const user = res.body as User
          expect(res.statusCode).toBe(201)
          expect(userResponseSchema.safeParse(user).success).toBe(true)
          expect(user.name).toBe(validUserData.name)
          expect(user.email).toBe(validUserData.email)
          expect(user.password).toBeUndefined()
        })
    })
  })

  describe('Fail Cases', () => {
    it('should fail to create user when email already exists', async () => {
      await request(app.getHttpServer())
        .post(userRoute.base)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          ...validUserData,
          email: duplicatedEmail,
        })
        .expect(409)
    })

    it('should fail to create user without required fields (name missing)', async () => {
      const { name, ...incompleteData } = validUserData
      await request(app.getHttpServer())
        .post(userRoute.base)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(incompleteData)
        .expect(400)
    })

    it('should fail to create user with an invalid email format', async () => {
      await request(app.getHttpServer())
        .post(userRoute.base)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ...validUserData, email: 'invalid-email' })
        .expect(400)
    })

    it('should fail to create user with additional fields (strict schema validation)', async () => {
      await request(app.getHttpServer())
        .post(userRoute.base)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ...validUserData, invalidField: true })
        .expect(400)
    })
  })

  afterAll(async () => {
    await teardownTestEnvironment(app)
  })
})
