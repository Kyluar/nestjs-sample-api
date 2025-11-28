import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AppModule } from '@/app.module'
import { TestConfigSchemaOutput } from '@/lib/dtos/config/config.dto'
import { LoginReturnDto, loginReturnSchema } from '@/lib/dtos/auth'
import { seed, clean } from '@/lib/config/prisma'
import { PrismaClient } from '@prisma/client'
import { login } from './login'

export type AppContext = {
  app: INestApplication
  loginPayload: LoginReturnDto
}

async function createApp(): Promise<INestApplication> {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile()

  const app = moduleRef.createNestApplication()

  await app.init()

  return app
}

async function createAuthenticatedApp(): Promise<AppContext> {
  const app = await createApp()

  const configService = app.get<ConfigService>(ConfigService)

  const credentials = configService.get<TestConfigSchemaOutput>('test')

  if (!credentials) throw new Error('Test credentials undefined')

  const loginResponse = await login(app, credentials)

  if (loginResponse.statusCode !== 201) throw new Error('Authentication Failed')
  else if (!loginReturnSchema.safeParse(loginResponse.body).success)
    throw new Error('Wrong login payload')

  const loginPayload = loginResponse.body as LoginReturnDto

  return {
    app,
    loginPayload,
  }
}

export async function setupTestEnvironment(): Promise<AppContext> {
  const prisma = new PrismaClient()
  try {
    await clean(prisma)
    await seed(prisma, false)
    return await createAuthenticatedApp()
  } catch (err) {
    console.error(err)
    throw new Error('Failed to setup test enviroment')
  } finally {
    prisma.$disconnect()
  }
}
