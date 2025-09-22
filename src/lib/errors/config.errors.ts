import { Environment } from '@/lib/types/common.types'
import { configSchema, ConfigSchemaInput } from '@/lib/dtos/config/config.dto'

export function validate(config: Record<string, any>): Record<string, any> {
  const configuration: ConfigSchemaInput = {
    nodeEnv: config.NODE_ENV as Environment,
    port: config.PORT,
    saltRounds: config.SALT_ROUNDS,
    auth: { secret: config.JWT_SECRET },
    database: {
      url: config.DATABASE_URL,
    },
    test: {
      email: config.TEST_USER_EMAIL,
      password: config.TEST_USER_PW,
    },
  }

  configSchema.parse(configuration)

  return config
}
