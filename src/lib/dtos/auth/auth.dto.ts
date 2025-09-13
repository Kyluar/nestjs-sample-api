import { z } from '@/lib/config/zod'
import { createZodDto } from 'nestjs-zod'

export const loginSchema = z.strictObject({
  email: z.email(),
  password: z.string().min(10),
})

export const loginReturnSchema = z.strictObject({
  accessToken: z.jwt(),
})

export type LoginReturnDto = z.infer<typeof loginReturnSchema>

export class LoginDto extends createZodDto(loginSchema) {}
