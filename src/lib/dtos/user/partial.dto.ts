import { userSchema } from './main.dto'
import { createZodDto } from 'nestjs-zod'

export const partialUserSchema = userSchema.partial()

export class PartialUserDto extends createZodDto(partialUserSchema) {}
