import { z } from '@/lib/config/zod'
import { createZodDto } from 'nestjs-zod'
import { Prisma } from '@prisma/client'
export const userSchema = z.strictObject({
  name: z.string().trim().nonempty(),
  email: z.email(),
  password: z.string(),
}) satisfies z.ZodType<Prisma.UserCreateInput>

export class UserDto extends createZodDto(userSchema) {}
