import { NestFactory, HttpAdapterHost } from '@nestjs/core'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { PrismaClientExceptionFilter } from '@/lib/filters'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const port = app.get(ConfigService).getOrThrow<number>('port')
  const corsOrigin = app.get(ConfigService).getOrThrow<string>('corsOrigin')

  app.enableCors({
    origin: corsOrigin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  })

  const config = new DocumentBuilder()
    .setTitle('Time Capsule API')
    .setDescription('Uma API para uma SPA de formulário.')
    .setVersion('0.1')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  const { httpAdapter } = app.get(HttpAdapterHost)
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter))

  await app.listen(port)
  console.info(`Server is running on port ${port}`)
  console.info(`Cors Origin: ${corsOrigin}`)
}

bootstrap()
