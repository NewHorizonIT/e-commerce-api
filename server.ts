import 'reflect-metadata';
import { config, databaseConnection, redisClient } from './src/config/index.js';
import { appLogger } from './src/shared/logging/appLogger.js';
import { ErrorLogger } from './src/shared/logging/errorLogger.js';
import { initContainer } from './src/shared/container/index.js';

async function bootstrap(): Promise<void> {
  try {
    initContainer();

    const { default: app } = await import('./src/app');
    await databaseConnection.connect();
    await redisClient.connect();

    const server = app.listen(config.app.port, () => {
      appLogger.info('E-Commerce API server started', {
        environment: config.app.env,
        port: config.app.port,
        host: config.app.host,
      });
    });

    server.on('close', () => appLogger.warn('Server is shutting down...'));
  } catch (error) {
    console.error('Server bootstrap failed:', error);
    ErrorLogger.error('Server bootstrap failed', 'SERVER_BOOTSTRAP_FAILED', {
      cause: error,
    });
    process.exit(1);
  }
}

void bootstrap();
