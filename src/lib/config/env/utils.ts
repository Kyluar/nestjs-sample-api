import { Environment } from '@/lib/types/common.types'
import { configSchema, ConfigSchemaOutput } from '@/lib/dtos/config/config.dto'

export function getConfig(config: Record<string, any>): ConfigSchemaOutput {
  const nodeEnv = config.NODE_ENV as Environment

  const configuration = {
    nodeEnv,
    port: config.PORT as string,
    saltRounds: config.SALT_ROUNDS as string,
    auth: { secret: config.JWT_SECRET as string },
    database: {
      url: config.DATABASE_URL as string,
    },
    corsOrigin: config.CORS_ORIGIN as string,
    ...(nodeEnv === Environment.Test && {
      test: {
        name: config.TEST_USER_NAME as string,
        email: config.TEST_USER_EMAIL as string,
        password: config.TEST_USER_PASSWORD as string,
      },
    }),
  }

  return configSchema.parse(configuration)
}
