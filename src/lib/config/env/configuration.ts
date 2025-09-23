import { ConfigSchemaOutput } from '@/lib/dtos/config/config.dto'
import { Environment } from '@/lib/types/common.types'
import { getConfig } from '@/lib/config/env/utils'

export const envFilePath: string | string[] = [
  '.env',
  `.env.${process.env.NODE_ENV ?? Environment.Development}`,
]

export function envConfiguration(): ConfigSchemaOutput {
  return getConfig(process.env)
}
