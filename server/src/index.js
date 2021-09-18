
import dotenv from 'dotenv';
import express from 'express'
import http from 'http';
import bodyParser from 'body-parser';
import { categorize } from './Azure.js';
import { Server } from "socket.io";

// database
const phoneCodes = {};

// express
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
   credentials: true
 }
});


dotenv.config();

// categorize('animal crossing').then((traits) => console.log(traits));

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('joinRoom', (room) => {
    socket.join(room)
  })
  socket.on('chat', ({room, msg, name}) => {
    io.to(room).emit('chat', {msg, name});
  })
});


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
