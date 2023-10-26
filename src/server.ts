import express from 'express';
import { logger, httpLogger } from "./helper/logger"
import { config } from "./config/config"

const app = express();
app.use(httpLogger);

app.get('/ping', function (req, res) {
  res.send('pong');
});

const port = config.port || 3002;

const server = app.listen(port, () => {
  logger.info(`App is up on port ${port}`);
});

export { app, server }
