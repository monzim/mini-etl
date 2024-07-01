import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  // console.log('Starting sync service...');
  // console.log(`RabbitMQ URL: ${process.env.RABBITMQ_URL}`);
  // console.log(`RabbitMQ Queue: ${process.env.RABBITMQ_QUEUE}`);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL],
        queue: process.env.RABBITMQ_QUEUE,
      },
    },
  );

  await app.listen();
}

bootstrap();
