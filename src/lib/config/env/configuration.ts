import { getConfig } from '@/lib/config/env/utils'
import type { ConfigSchemaOutput } from '@/lib/dtos/config/config.dto'

export function envConfiguration(): ConfigSchemaOutput {
  return getConfig(process.env)
}
