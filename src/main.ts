import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // evitar el error de CORS
  app.enableCors();

  // este codigo es para hacer super restringido nuestro backend, para que envien la data como la solicito sino no recibo nada
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    })
  );

  await app.listen( process.env.PORT ?? 3000 );
}
bootstrap();
