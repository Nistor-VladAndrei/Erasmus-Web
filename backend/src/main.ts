// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    console.log('[bootstrap] start - NODE_ENV=', process.env.NODE_ENV);
    console.log('[bootstrap] entry file:', __filename);

    const app = await NestFactory.create(AppModule);
    console.log('[bootstrap] NestFactory.create() resolved');

    // Enable CORS
    const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3003';
    app.enableCors({
      origin: corsOrigin,
      credentials: true,
    });
    console.log('[bootstrap] CORS enabled for:', corsOrigin);

    // Enable validation pipes globally
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    console.log('[bootstrap] Global validation pipe configured');

    // Set global prefix for API routes
    app.setGlobalPrefix('api');
    console.log('[bootstrap] Global prefix = /api');

    const port = Number(process.env.PORT || 3003);
    await app.listen(port);
    console.log(`🚀 Backend server running on http://localhost:${port}`);
    console.log(`📚 API documentation available at http://localhost:${port}/api`);
  } catch (err) {
    console.error('[bootstrap] ERROR starting app:', err);
    // give a non-zero exit for process managers
    process.exitCode = 1;
  }
}

// catch any runtime problems not caught inside bootstrap
process.on('uncaughtException', (err) => {
  console.error('[uncaughtException]', err);
  // Optionally exit: process.exit(1);
});
process.on('unhandledRejection', (reason) => {
  console.error('[unhandledRejection]', reason);
  // Optionally exit: process.exit(1);
});

bootstrap();
