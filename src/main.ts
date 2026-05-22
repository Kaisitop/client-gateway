import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger, Logger, ValidationPipe} from '@nestjs/common';
import { envs } from './config';
import { RpcCustomExceptionFilter } from './common';

async function bootstrap() {
  const logger = new Logger('Main-Gateway')
  const app = await NestFactory.create(AppModule);
  console.log('hola mundito')
  app.setGlobalPrefix('api')
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new RpcCustomExceptionFilter())
  await app.listen(process.env.PORT ?? 3000);
  console.log("HOla ")
  logger.log(`Gateway corrriend en el puerto ${envs.port}`)
}
bootstrap();
