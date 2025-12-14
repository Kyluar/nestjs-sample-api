import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { TestConfigSchemaOutput } from '@/lib/dtos/config/config.dto'
import { Response } from 'supertest'

export async function login(
  app: INestApplication,
  credentials: Omit<TestConfigSchemaOutput, 'name'>
): Promise<Response> {
  return await request(app.getHttpServer())
    .post('/auth/login')
    .send(credentials)
}
