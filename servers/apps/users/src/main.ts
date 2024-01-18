import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import ejs from 'ejs';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(UsersModule);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'servers/email-templates'));


    // Enable CORS
  const corsOptions: CorsOptions = {
    origin: 'http://localhost:3000',  // Replace with the actual origin of your frontend
    credentials: true,
  };
  app.enableCors(corsOptions);

  app.setViewEngine("ejs");
  
  await app.listen(4001);
}
bootstrap();