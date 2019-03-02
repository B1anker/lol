import { NestFactory } from '@nestjs/core';
import { CORS } from './app.config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin (requestOrigin, callback) {
      const pass = CORS.whiteList.some((item) => item.indexOf(requestOrigin) !== -1);
      callback(null, pass);
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    optionsSuccessStatus: 204
  });
  await app.listen(3333);
}
bootstrap();
