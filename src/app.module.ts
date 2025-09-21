import { Module } from '@nestjs/common'
import { CustomZodValidationPipe } from './lib/pipes'
import { APP_PIPE, APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './guards'
import { UserModule, PostModule, AuthModule, HealthModule } from './modules'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from 'nestjs-prisma'
import { envConfiguration, envFilePath } from '@/lib/config/env'
import { validate } from '@/lib/errors'

@Module({
  imports: [
    PrismaModule.forRoot({ isGlobal: true }),
    UserModule,
    PostModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfiguration],
      envFilePath,
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
