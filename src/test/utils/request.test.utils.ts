import * as request from 'supertest'
import { Data } from '@/lib/types/common.types'
import { App } from 'supertest/types'
import {
  RequestTestParams,
  RequestDataValidationTestParams,
  GetRequestMethodParams,
  GetRequestTestParams,
} from '../types/request.test.types.utils'

function getTestRequestMethod({ server, method, url }: GetRequestMethodParams) {
  const req = request(server)
  let testRequest: request.Test

  switch (method) {
    case 'GET':
      testRequest = req.get(url)
      break
    case 'PUT':
      testRequest = req.put(url)
      break
    case 'PATCH':
      testRequest = req.patch(url)
      break
    case 'DELETE':
      testRequest = req.delete(url)
      break
    case 'POST':
    default:
      testRequest = req.post(url)
      break
  }

  return testRequest
}

export function requestTest<T extends Data>({
  getApp,
  getJwtToken,
  name,
  url,
  status,
  requestData,
  method,
}: RequestTestParams<T>) {
  return it(name, async () => {
    const server = getApp().getHttpServer() as App
    const authorization = getJwtToken
      ? { field: 'Authorization', val: `Bearer ${getJwtToken()}` }
      : { field: 'Authorization', val: '' }

    const testRequest = getTestRequestMethod({ server, url, method })

    return testRequest
      .set(authorization.field, authorization.val)
      .send(requestData)
      .expect(status)
  })
}

export function requestDataValidationTest<T extends Data>({
  requestData,
  invalidData,
  ...params
}: RequestDataValidationTestParams<T>) {
  const data = {
    ...requestData,
    ...invalidData,
  }
  const status = 400
  return requestTest({ ...params, requestData: data, status, method: 'POST' })
}

export function requestGetTest(params: GetRequestTestParams) {
  const status = 200
  return requestTest({ ...params, status, method: 'GET' })
}
