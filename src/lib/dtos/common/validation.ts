import { z } from '@/lib/config/zod'
import { processToString } from '@/lib/dtos/common'

export const dbConfigValidation = {
  regex: /^mysql:\/\/([^:]+):(.+)@([^@:]+):(\d+)\/(\w+)$/,
  message: 'O format do DATABASE_URL é inválido',
}

export const envVarValidation = z.preprocess(
  processToString,
  z.string().trim().nonempty()
)
