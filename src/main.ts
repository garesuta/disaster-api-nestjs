import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set up global prefix /api
  app.setGlobalPrefix('api');
  app.enableCors();
  // Set up global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors) => {
        const messages = errors.map((error) => ({
          field: error.property,
          message: error.constraints
            ? Object.values(error.constraints).join(', ') + '.'
            : 'Validation error.',
        }));
        return new BadRequestException({ errors: messages });
      },
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Disaster Resource Allocation API')
    .setDescription(
      'Disaster Management API by Resource matching and Priority by Urgency area within Time Constraints',
    )
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on port: ${process.env.PORT}`);
}
bootstrap();
