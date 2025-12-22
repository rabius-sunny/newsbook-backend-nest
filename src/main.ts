import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters';
import { TransformResponseInterceptor } from './common/interceptors';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set global prefix
  app.setGlobalPrefix('api/v1');

  // Enable CORS
  app.enableCors();

  // Global filters
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Global interceptors
  app.useGlobalInterceptors(new TransformResponseInterceptor());

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Newsbook Backend')
    .setDescription('The Newsbook API description')
    .setVersion('1.0')
    .addTag('newsbook')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1', app, documentFactory);

  const port = process.env.PORT;
  await app.listen(port!);

  console.log(`Application is running on: http://localhost:${port}/api/v1`);
}
bootstrap();
