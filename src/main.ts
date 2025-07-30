import { NestFactory, HttpAdapterHost } from '@nestjs/core'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { PrismaClientExceptionFilter } from '@/lib/filters'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

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

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
