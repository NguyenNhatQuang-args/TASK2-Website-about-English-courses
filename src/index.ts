import createApp from './app';
import { config } from './config';
import { connectDatabase } from './config/database';
import { seedDefaultData } from './seeds/seed';

// Start server
const startServer = async (): Promise<void> => {
  try {
    // Connect to database
    await connectDatabase();

    // Seed default data
    await seedDefaultData();

    // Create Express app
    const app = createApp();

    // Start listening
    app.listen(config.port, () => {
      console.log(`
========================================
  Server is running!
  Environment: ${config.nodeEnv}
  Port: ${config.port}
  API: http://localhost:${config.port}${config.api.prefix}
========================================
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: Error) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start the server
startServer();
