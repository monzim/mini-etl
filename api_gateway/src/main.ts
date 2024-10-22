import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: ['error', 'warn', 'log'],
  });

  app.enableCors({
    origin: [process.env.FRONTEND_URL],
  });
  app.setGlobalPrefix('/api');
  await app.listen(3000);
}
bootstrap();
