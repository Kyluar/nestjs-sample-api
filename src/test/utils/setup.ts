import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AppModule } from '@/app.module'
import * as request from 'supertest'
import { TestConfigSchemaOutput } from '@/lib/dtos/config/config.dto'
import { LoginReturnDto } from '@/lib/dtos/auth'

export type AppContext = {
  app: INestApplication
  jwtToken: string
  loginPayload: LoginReturnDto
}

export async function createAuthenticatedApp(): Promise<AppContext> {
  // 1. Cria o módulo
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile()

  const app = moduleRef.createNestApplication()
  const configService = app.get<ConfigService>(ConfigService)

  // 2. Inicializa o App
  await app.init()

  // 3. Realiza o Login
  const credentials = configService.get<TestConfigSchemaOutput>('test')

  const loginResponse = await request(app.getHttpServer())
    .post('/auth/login')
    .send(credentials)

  const loginPayload: LoginReturnDto = loginResponse.body
  const jwtToken = loginPayload.accessToken

  // 4. Retorna tudo que os testes precisam
  return {
    app,
    jwtToken,
    loginPayload,
  }
}
