import { ZodError } from 'zod'
import { createZodValidationPipe } from 'nestjs-zod'
import { BadRequestException } from '@nestjs/common'

export const CustomZodValidationPipe = createZodValidationPipe({
  createValidationException: (error: ZodError) =>
    new BadRequestException({
      message: error.issues[0].message,
    }),
})
