import express from 'express';
import { logger, httpLogger } from "./helpers/logger.helper"
import { config } from "./config"
import { connectDB } from './database/db';
import { userRoute } from './routes/user.router';

const app = express();
app.use(express.json());
app.use(httpLogger);
app.use('/api', userRoute);

app.get('/ping', function (req, res) {
  res.send('pong');
});

const port = config.port || 3002;

const server = app.listen(port, () => {
  logger.info(`App is up on port ${port}`);
});

connectDB(config.mongoURI)
.catch((e) =>
  server.close(e)
)
export { app, server }
