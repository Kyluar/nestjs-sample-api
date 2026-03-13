import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD, APP_PIPE } from '@nestjs/core'
import { CustomPrismaModule } from 'nestjs-prisma'
import { envConfiguration } from '@/lib/config/env/configuration'
import { validate } from '@/lib/config/env/validation'
import { JwtAuthGuard } from './guards'
import { extendedPrismaClient } from './lib/config/prisma/extensions'
import { CustomZodValidationPipe } from './lib/pipes'
import { AuthModule, HealthModule, PostModule, UserModule } from './modules'

@Module({
  imports: [
    CustomPrismaModule.forRootAsync({
      name: 'PrismaService',
      isGlobal: true,
      useFactory: () => {
        return extendedPrismaClient
      },
    }),
    UserModule,
    PostModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfiguration],
      validate,
    }),
    HealthModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: CustomZodValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
