import { z } from '@/lib/config/zod'
import { createZodDto } from 'nestjs-zod'

export const loginSchema = z.strictObject({
  email: z.email(),
  password: z.string().min(10),
})

export class LoginDto extends createZodDto(loginSchema) {}
