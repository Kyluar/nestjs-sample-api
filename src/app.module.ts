import { Module } from '@nestjs/common'
import { CustomZodValidationPipe } from './lib/pipes'
import { APP_PIPE, APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './guards'
import { UserModule, PostModule, PrismaModule, AuthModule } from './modules'
import { ConfigModule } from '@nestjs/config'
import { HealthModule } from './modules'
import configuration from '@/lib/config/env'
@Module({
  imports: [
    PrismaModule,
    UserModule,
    PostModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
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
