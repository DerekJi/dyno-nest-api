import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';

function setupSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('LDP API')
    .setDescription('The LDP API description')
    .setVersion('1.0')
    .addTag('ldp')
    .build();
    
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupSwagger(app);
  
  await app.listen(3000);
}
bootstrap();
