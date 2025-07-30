import {
  Get,
  Delete,
  Param,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common'

import { DataType } from '../types'
import { BaseService } from './base.service'

export abstract class BaseController<D extends DataType> {
  constructor(protected service: BaseService<D>) {}

  @Get()
  list(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number
  ) {
    return this.service.list(limit, page)
  }

  @Get(':uuid')
  get(@Param('uuid') uuid: string) {
    return this.service.get(uuid)
  }

  @Delete()
  delete() {
    return this.service.delete()
  }

  abstract create(body: any): D | string

  abstract update(uuid: string, body: any): D | string

  abstract patch(uuid: string, body: any): D | string
}
