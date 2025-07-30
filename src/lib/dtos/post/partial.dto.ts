import { createZodDto } from 'nestjs-zod'
import { postSchema } from './main.dto'
export const partialPostSchema = postSchema.partial()

export class PartialPostDto extends createZodDto(partialPostSchema) {}
