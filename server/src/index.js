
import dotenv from 'dotenv';
import { Syncrosse } from '@syncrosse/server'
import express from 'express'
import http from 'http';
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

const authenticate = (req, res, next) => {
  // check headers for id
  if (!db.users.hasOwnProperty(req.header('User-Id'))) {
    res.sendStatus(401);
  } else {
    next();
  }
}

const generatePhoneCode = (phoneNumber) => {
  const code = Math.floor(Math.random() * 9000) + 1000;
  phoneCodes[phoneNumber] = code;
}

/**
 * Login route (login and sign up)
 * First sign-in will generate a code
 */
app.post('/login', (req, res) => {
  const { phone_number, code } = req.body;
  if (!phone_number) {
    req.sendStatus(400);
    return;
  }

  // generate code if no entry exists
  if (!phoneCodes.hasOwnProperty(phone_number)) {
    // twilio api call
    generatePhoneCode(phone_number);
    res.sendStatus(401);
    return;
  }

  if (!code) {
    req.sendStatus(400);
    return;
  }
  // send 200 if code matches, else 401
  if (code === phoneCodes[phone_number]) {
    // if user exists, redirect to /home
    // if not, redirect to /details
    const id = req.header('User-Id');
    if (db.users.hasOwnProperty(id)) {
      res.status.json({ redirect: '/home' });
    } else {
      // !TODO: create user entry
      // db.users[someNewID] = { phone_number };
      res.status.json({ redirect: '/details' });
    }
  } else {
    res.sendStatus(401);
  }
});

/**
 * Route to update user details
 */
app.post('/user/details', authenticate, (req, res) => {

});

/**
 * Route to update user phone number
 */
app.post('/user/phone', authenticate, (req, res) => {
  // Similar flow to login
  // generatePhoneCode(phone_number);
});

/**
 * Route to get current user's details (plant related?)
 */
app.get('/user', authenticate, (req, res) => {

});

/**
 * Route to get a list of user's buds
 */
app.get('/buds', authenticate, (req, res) => {

});

/**
 * Route to get details for a user's specific bud
 */
app.get('/buds/:id', authenticate, (req, res) => {

});

server.listen(process.env.PORT, () => {
  console.log(`listening on *:${process.env.PORT}`);
});
