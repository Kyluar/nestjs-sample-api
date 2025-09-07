import { createZodDto } from 'nestjs-zod'
import { createPostSchema } from './create.dto'
export const updatePostSchema = createPostSchema.partial()

export class UpdatePostDto extends createZodDto(updatePostSchema) {}
