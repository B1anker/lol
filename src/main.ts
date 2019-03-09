import { NestFactory } from '@nestjs/core';
import { CORS } from './app.config';
import { AppModule } from './app.module';
import { TransformInterceptor } from './interceptor/transform.interceptor';

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
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(3333);
}
bootstrap();
