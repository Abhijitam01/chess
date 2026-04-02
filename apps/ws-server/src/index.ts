import { config } from './config.js';
import { DatabaseService } from './services/DatabaseService.js';
import { RedisService } from './services/RedisService.js';
import { AuthService } from './services/AuthService.js';
import { createServer } from './server.js';
import { logger } from './logger.js';

async function main() {
  const dbService = new DatabaseService();
  const redisService = new RedisService();
  const authService = new AuthService(dbService);

  await redisService.connect();

  const { httpServer, shutdown } = createServer({ dbService, redisService, authService });

  httpServer.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      logger.error(`Port ${config.port} is already in use. Is another instance running?`);
    } else {
      logger.error({ err }, 'HTTP server error');
    }
    process.exit(1);
  });

  httpServer.listen(config.port, () => {
    logger.info(`Server listening on port ${config.port}`);
  });

  process.on('SIGTERM', () => {
    shutdown('SIGTERM').then(() => process.exit(0)).catch((err) => {
      logger.error({ err }, 'SIGTERM handler failed');
      process.exit(1);
    });
  });
  process.on('SIGINT', () => {
    shutdown('SIGINT').then(() => process.exit(0)).catch((err) => {
      logger.error({ err }, 'SIGINT handler failed');
      process.exit(1);
    });
  });
}

main().catch((err) => {
  logger.error({ err }, 'Failed to start server');
  process.exit(1);
});
