import { ConfigSchemaInput } from '@/lib/dtos/config/config.dto'
import { Environment } from '@/lib/types/common.types'

export const envFilePath: string | string[] = [
  '.env',
  `.env.${process.env.NODE_ENV ?? Environment.Development}`,
]

export function envConfiguration() {
  const config: ConfigSchemaInput = {
    nodeEnv: process.env.NODE_ENV as Environment,
    port: process.env.PORT,
    saltRounds: process.env.SALT_ROUNDS,
    auth: { secret: process.env.JWT_SECRET },
    database: {
      url: process.env.DATABASE_URL,
    },
    test: {
      email: process.env.TEST_USER_EMAIL,
      password: process.env.TEST_USER_PW,
    },
  }

  return config
}
