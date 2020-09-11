import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';

function setupSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('SimpleApplicationService API')
    .setDescription('The SimpleApplicationService API description')
    .setVersion('v1')
    // .addTag('SAS')
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
