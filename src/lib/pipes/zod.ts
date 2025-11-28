import { ZodError } from 'zod'
import { createZodValidationPipe, ZodValidationPipe } from 'nestjs-zod'
import { BadRequestException } from '@nestjs/common'

export const CustomZodValidationPipe: typeof ZodValidationPipe =
  createZodValidationPipe({
    createValidationException: (error: ZodError) =>
      new BadRequestException({
        message: error.issues[0].message,
      }),
  })
