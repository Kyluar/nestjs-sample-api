import { Data, PartialData } from '@/lib/types/common.types'
import { INestApplication } from '@nestjs/common'
import { Response } from 'supertest'
import { App } from 'supertest/types'

export type HttpMethod = 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE'

export type GetRequestMethodParams = {
  server: App
  method: HttpMethod
  url: string
}

export type RequestTestParams<T extends Data> = Omit<
  GetRequestMethodParams,
  'server'
> & {
  getApp: () => INestApplication
  getJwtToken?: () => string
  resCallback?: (res: Response) => void
  name: string
  requestData?: T
  status: number
}

export type RequestDataValidationTestParams<T extends Data> = Pick<
  RequestTestParams<T>,
  'getApp' | 'name' | 'url'
> & {
  getJwtToken: () => string
  requestData: T
  invalidData: PartialData<T>
}

export type GetRequestTestParams = Omit<
  RequestTestParams<Data>,
  'status' | 'method' | 'requestData'
>
