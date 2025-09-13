import { z } from '@/lib/config/zod'
import { createZodDto } from 'nestjs-zod'
import { Prisma, Post } from '@prisma/client'
import { timestampSchema } from '../common'

export const createPostSchema = z.strictObject({
  authorUuid: z.uuid(),
  title: z.string().trim().nonempty().max(30),
  content: z.string().trim().nonempty().max(100),
  published: z.boolean().default(true),
}) satisfies z.ZodType<Prisma.PostCreateInput>

export const updatePostSchema = createPostSchema.partial()

export const postSchema = z.strictObject({
  uuid: z.uuid(),
  ...createPostSchema.shape,
  ...timestampSchema.shape,
}) satisfies z.ZodType<Post>

export class CreatePostDto extends createZodDto(createPostSchema) {}
export class UpdatePostDto extends createZodDto(updatePostSchema) {}
