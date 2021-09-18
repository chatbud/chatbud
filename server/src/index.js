
const dotenv = require('dotenv');

const { Syncrosse } = require('@syncrosse/server');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const syncrosse = new Syncrosse(server);

dotenv.config();

syncrosse.onAction('ping', ({ user, data, lobby }) => {
  lobby.triggerEvent('pong', data);
});

syncrosse.start();

server.listen(process.env.PORT, () => {
  console.log(`listening on *:${process.env.PORT}`);
});
