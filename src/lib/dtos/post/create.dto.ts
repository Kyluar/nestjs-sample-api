import { z } from '@/lib/config/zod'
import { createZodDto } from 'nestjs-zod'
import { Prisma, Post } from '@prisma/client'

export const createPostSchema = z.strictObject({
  authorUuid: z.uuid(),
  title: z.string().trim().nonempty().max(30),
  content: z.string().trim().nonempty().max(100),
  published: z.boolean().default(true),
}) satisfies z.ZodType<Prisma.PostCreateInput>

export const postSchema = z.strictObject({
  uuid: z.uuid(),
  ...createPostSchema.shape,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
}) satisfies z.ZodType<Post>

export class CreatePostDto extends createZodDto(createPostSchema) {}
