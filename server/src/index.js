
import dotenv from 'dotenv';
import { Syncrosse} from '@syncrosse/server'
import express from 'express'
import http from 'http';
import fetch from 'node-fetch';

const app = express();
const server = http.createServer(app);
const syncrosse = new Syncrosse(server);
dotenv.config();

syncrosse.onAction('ping', ({ user, data, lobby }) => {
  lobby.triggerEvent('pong', data);
});

syncrosse.start();
async function categorize(query) {
  const url = process.env.AZURE_URL + query;

  const resp = await fetch(url);

  const json = await resp.json()

  return json;
}

categorize('animal crossing').then((traits) => console.log(traits));

server.listen(process.env.PORT, () => {
  console.log(`listening on *:${process.env.PORT}`);
});
