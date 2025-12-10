import { ConfigSchemaOutput } from '@/lib/dtos/config/config.dto'
import { getConfig } from '@/lib/config/env/utils'

export function envConfiguration(): ConfigSchemaOutput {
  return getConfig(process.env)
}
