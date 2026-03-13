import type { INestApplication } from '@nestjs/common'
import type { Response } from 'supertest'
import * as request from 'supertest'
import type { TestConfigSchemaOutput } from '@/lib/dtos/config/config.dto'

export async function login(
  app: INestApplication,
  credentials: Omit<TestConfigSchemaOutput, 'name'>
): Promise<Response> {
  return await request(app.getHttpServer())
    .post('/auth/login')
    .send(credentials)
}
