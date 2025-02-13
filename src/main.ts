import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    methods: ['POST', 'GET', 'PUT', 'DELETE'],
  });

  await app.listen(3000);
  console.log('App running on port 3000');
}
bootstrap();
