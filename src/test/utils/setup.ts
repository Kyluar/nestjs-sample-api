import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AppModule } from '@/app.module'
import { TestConfigSchemaOutput } from '@/lib/dtos/config/config.dto'
import { LoginReturnDto, loginReturnSchema } from '@/lib/dtos/auth'
import { seed, clean } from '@/lib/config/prisma'
import { PrismaClient } from '@prisma/client'
import { login } from './login'
import { HttpAdapterHost } from '@nestjs/core'
import { PrismaClientExceptionFilter } from '@/lib/filters'

export type AppContext = {
  app: INestApplication
  loginPayload: LoginReturnDto
}

async function createApp(): Promise<INestApplication> {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile()

  const app = moduleRef.createNestApplication()

  const { httpAdapter } = app.get(HttpAdapterHost)

  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter))

  await app.init()

  return app
}

async function createAuthenticatedApp(): Promise<AppContext> {
  const app = await createApp()

  const configService = app.get<ConfigService>(ConfigService)

  const testConfig = configService.get<TestConfigSchemaOutput>('test')

  if (!testConfig) throw new Error('Test credentials undefined')

  const credentials: Omit<TestConfigSchemaOutput, 'name'> = {
    email: testConfig.email,
    password: testConfig.password,
  }

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
