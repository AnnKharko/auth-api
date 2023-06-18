import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: false }));
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const PORT = app.get(ConfigService).get('PORT');

  await app.listen(PORT);
}
bootstrap();
