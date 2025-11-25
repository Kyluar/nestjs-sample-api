import * as request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AppModule } from '@/app.module'
import { Post } from '@prisma/client'
import { LoginReturnDto, loginReturnSchema } from '@/lib/dtos/auth'
import { postSchema } from '@/lib/dtos/post'
import { TestConfigSchemaOutput } from '@/lib/dtos/config/config.dto'
import { postRoutes } from '@/test/mock'

describe('Module Post: GET Tests', () => {
  let app: INestApplication
  let jwtToken: string
  let configService: ConfigService
  let loginPayload: LoginReturnDto

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    configService = app.get<ConfigService>(ConfigService)
    await app.init()

    const credentials = configService.get<TestConfigSchemaOutput>('test')

    loginPayload = (
      await request(app.getHttpServer()).post('/auth/login').send(credentials)
    ).body

    jwtToken = loginPayload.accessToken
  })

  describe('Authentication', () => {
    it('should be authenticated', () => {
      expect(loginReturnSchema.safeParse(loginPayload).success).toBe(true)
    })
  })

  describe(`Success cases`, () => {
    describe(`${postRoutes.feed}`, () => {
      it(`should return an array of published posts`, async () => {
        await request(app.getHttpServer())
          .get(postRoutes.feed)
          .set('Authorization', `Bearer ${jwtToken}`)
          .expect((res) => {
            const posts = res.body as Post[]
            expect(
              posts.every((post) => postSchema.safeParse(post).success)
            ).toBe(true)
            expect(posts.every((post) => post.published)).toBe(true)
            expect(res.statusCode).toBe(200)
          })
      })
    })
    describe(`${postRoutes.draft}`, () => {
      it(`should return an array of draft posts`, async () => {
        await request(app.getHttpServer())
          .get(postRoutes.draft)
          .set('Authorization', `Bearer ${jwtToken}`)
          .expect((res) => {
            const posts = res.body as Post[]
            expect(
              posts.every((post) => postSchema.safeParse(post).success)
            ).toBe(true)
            expect(posts.every((post) => !post.published)).toBe(true)
            expect(res.statusCode).toBe(200)
          })
      })
    })
  })

  describe(`Fail cases`, () => {
    describe(`${postRoutes.feed}`, () => {
      it(`should fail when not authenticated`, async () => {
        await request(app.getHttpServer()).get(postRoutes.feed).expect(401)
      })
    })
    describe(`${postRoutes.draft}`, () => {
      it(`should fail when not authenticated`, async () => {
        await request(app.getHttpServer()).get(postRoutes.draft).expect(401)
      })
    })
  })

  afterAll(async () => {
    await app.close()
  })
})
