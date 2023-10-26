import express from 'express';
const app = express();

app.get('/ping', function (req, res) {
  res.send('pong');
});

app.listen(3000, () => {
  console.log('App is up on port 3000');
});
