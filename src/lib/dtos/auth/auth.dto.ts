import { createZodDto } from 'nestjs-zod'
import { z } from '@/lib/config/zod'
import { userSchema } from '../user'

export const loginSchema = z.strictObject(
  userSchema.pick({ email: true, password: true }).shape
)

export const loginReturnSchema = z.strictObject({
  accessToken: z.jwt(),
  userUuid: z.uuid(),
})

export type LoginReturnDtoType = z.infer<typeof loginReturnSchema>

export class LoginDto extends createZodDto(loginSchema) {}
export class LoginReturnDto extends createZodDto(loginReturnSchema) {}
