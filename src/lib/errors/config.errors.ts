import { Environment } from '../dtos/config/config.dto'
import { configSchema, ConfigSchemaInput } from '../dtos/config/config.dto'

export function validate(config: Record<string, any>): Record<string, any> {
  const configuration: ConfigSchemaInput = {
    nodeEnv: config.NODE_ENV as Environment,
    port: config.PORT,
    saltRounds: config.SALT_ROUNDS,
    auth: { secret: config.JWT_SECRET },
    database: {
      url: config.DATABASE_URL,
    },
  }

  configSchema.parse(configuration)

  return config
}
