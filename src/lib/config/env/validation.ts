import { getConfig } from '@/lib/config/env/utils'

export function validate(config: Record<string, any>): Record<string, any> {
  getConfig(config)
  return config
}
