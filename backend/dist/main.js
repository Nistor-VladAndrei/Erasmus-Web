"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    try {
        console.log('[bootstrap] start - NODE_ENV=', process.env.NODE_ENV);
        console.log('[bootstrap] entry file:', __filename);
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        console.log('[bootstrap] NestFactory.create() resolved');
        const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3003';
        app.enableCors({
            origin: corsOrigin,
            credentials: true,
        });
        console.log('[bootstrap] CORS enabled for:', corsOrigin);
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
        }));
        console.log('[bootstrap] Global validation pipe configured');
        app.setGlobalPrefix('api');
        console.log('[bootstrap] Global prefix = /api');
        const port = Number(process.env.PORT || 3003);
        await app.listen(port);
        console.log(`🚀 Backend server running on http://localhost:${port}`);
        console.log(`📚 API documentation available at http://localhost:${port}/api`);
    }
    catch (err) {
        console.error('[bootstrap] ERROR starting app:', err);
        process.exitCode = 1;
    }
}
process.on('uncaughtException', (err) => {
    console.error('[uncaughtException]', err);
});
process.on('unhandledRejection', (reason) => {
    console.error('[unhandledRejection]', reason);
});
bootstrap();
//# sourceMappingURL=main.js.map