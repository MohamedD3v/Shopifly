import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger } from '@nestjs/common';

async function bootstrap(): Promise<void> {
  const port: number = Number(process.env.PORT) || 5000;
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      prefix: 'Shopifly',
    }),
  });
  await app.listen(port, () => {
    console.log(`Server is Running on http://localhost:${port}`);
  });
}
bootstrap();
