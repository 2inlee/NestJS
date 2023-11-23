import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    // 임의로 변환하는걸 가능하게 만들어준다. EX) pagination에서 url파라미터를 number로 생각함
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  await app.listen(3000);
}
bootstrap();
