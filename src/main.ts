import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/exception-filter/http.exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    // 임의로 변환하는걸 가능하게 만들어준다. ex) pagination에서 url파라미터를 number로 생각함
    transformOptions: {
      enableImplicitConversion: true,
    },
    whitelist : true,
    forbidNonWhitelisted: true,
  }));

  await app.listen(3000);
}
bootstrap();
