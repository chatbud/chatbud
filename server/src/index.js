
import dotenv from 'dotenv';
import { Syncrosse } from '@syncrosse/server'
import express from 'express'
import http from 'http';
import bodyParser from 'body-parser';
import { categorize } from './Azure.js';

// database
const phoneCodes = {};

// express
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const server = http.createServer(app);

// sockets
const syncrosse = new Syncrosse(server);
dotenv.config();

syncrosse.onAction('ping', ({ user, data, lobby }) => {
  lobby.triggerEvent('pong', data);
});

syncrosse.start();

categorize('animal crossing').then((traits) => console.log(traits));

app.post('/login', (req, res) => {
  const { phone_number } = req.body;
  if (!phone_number) {
    req.sendStatus(401);
    return;
  }

  // twilio api call
  phoneCodes[phone_number] = '123456';
  res.sendStatus(200);
});

app.post('/login/2fa', (req, res) => {
  const { phone_number, code } = req.body;
  if (!phone_number || !code) {
    res.sendStatus(401);
    return;
  }
  const verified = code === phoneCodes[phone_number];
  if (verified) {
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});

server.listen(process.env.PORT, () => {
  console.log(`listening on *:${process.env.PORT}`);
});
