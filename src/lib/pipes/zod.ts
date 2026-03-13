import { BadRequestException } from '@nestjs/common'
import { createZodValidationPipe, type ZodValidationPipe } from 'nestjs-zod'
import type { ZodError } from 'zod'

export const CustomZodValidationPipe: typeof ZodValidationPipe =
  createZodValidationPipe({
    createValidationException: (error: ZodError) =>
      new BadRequestException({
        message: error.issues[0].message,
      }),
  })
