
import dotenv from 'dotenv';
import { Syncrosse} from '@syncrosse/server'
import express from 'express'
import http from 'http';
import { categorize } from './Azure.js';

const app = express();
const server = http.createServer(app);
const syncrosse = new Syncrosse(server);
dotenv.config();

syncrosse.onAction('ping', ({ user, data, lobby }) => {
  lobby.triggerEvent('pong', data);
});

syncrosse.start();

categorize('animal crossing').then((traits) => console.log(traits));

server.listen(process.env.PORT, () => {
  console.log(`listening on *:${process.env.PORT}`);
});
