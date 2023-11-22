import express from 'express';
import { logger, httpLogger } from "./helpers/logger"
import { config, connectDB } from "./config"
import { userRoute } from './routes/user';
import { authenticate, isVerified } from './middleware';
import { urlRoute } from './routes/url';

const app = express();
app.use(express.json());
app.use(httpLogger);
app.use('/api', userRoute);
app.use('/api', urlRoute);


app.get('/api/ping', authenticate, isVerified, function (req, res) {
  res.send('pong');
});

const startServer = async () => {
  try {
    await connectDB(config.mongoURI);
    const port = config.port || 3002;
    const server = app.listen(port, () => {
      logger.info(`App is up on port ${port}`);
    });

    process.on('SIGINT', () => {
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error(`Failed to connect to the database: ${error}`);
  }
};

startServer();