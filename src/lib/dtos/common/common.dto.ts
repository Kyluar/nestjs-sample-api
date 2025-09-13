import { z } from '@/lib/config/zod'

export const timestampSchema = z.strictObject({
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})
