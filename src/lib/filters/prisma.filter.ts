import { ArgumentsHost, Catch } from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'
import { Prisma } from '@prisma/client'
import { Response } from 'express'
import { getPrismaExceptionResponse } from '@/lib/errors'

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    console.error(exception.message)
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const info = getPrismaExceptionResponse(exception)

    if (!info.statusCode) return super.catch(exception, host)

    response.status(info.statusCode).json(info)
  }
}
