import { app } from './app.js';
import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';

async function bootstrap() {
  try {
    await connectDatabase();
  } catch (error) {
    if (env.MONGODB_REQUIRED || env.NODE_ENV === 'production') {
      throw error;
    }

    console.warn('MongoDB connection failed; API is starting with database-dependent routes unavailable.');
    console.warn(error.message);
  }

  app.listen(env.PORT, () => {
    console.log(`API listening on http://localhost:${env.PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error('Server failed to start', error);
  process.exit(1);
});
