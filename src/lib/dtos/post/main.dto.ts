import { z } from '@/lib/config/zod'
import { createZodDto } from 'nestjs-zod'
import { Prisma } from '@prisma/client'
export const postSchema = z.strictObject({
  authorUuid: z.uuid(),
  title: z.string().trim().nonempty().max(30),
  content: z.string().trim().nonempty().max(100),
  published: z.boolean().optional(),
}) satisfies z.ZodType<Prisma.PostCreateInput>

export class PostDto extends createZodDto(postSchema) {}
