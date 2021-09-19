import dotenv from "dotenv";
import express from "express";
import http from "http";
import { categorize } from "./Azure.js";
import { Server } from "socket.io";
import cors from "cors";
import twilio from "twilio";
dotenv.config();

// twilio
const twilioSID = process.env.TWILIO_SID;
const twilioToken = process.env.TWILIO_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_NUMBER;
const twilioClient = twilio(twilioSID, twilioToken);

// database
const phoneCodes = {};
const db = {
  users: {
    0: {
      name: "Devon",
      yearOfBirth: "3",
      interests: ["cookies", "python3.0"],
      avatarSeed: "devon",
      favInterest: "tech",
    },
    1: {
      name: "Kookie Kat",
      yearOfBirth: "3",
      interests: ["cookies", "animal crossing", "python3.0"],
      avatarSeed: "nami3",
      favInterest: "video games",
    },
    2: {
      name: "Vinh T",
      yearOfBirth: "3",
      interests: ["lunch"],
      avatarSeed: "vinh",
      favInterest: "tech",
    },
    3: {
      name: "Deen",
      yearOfBirth: "3",
      interests: ["tech", "python3.0"],
      avatarSeed: "d",
      favInterest: "politics",
    },
  },
  buds: {
    1: {
      users: [
        {
          id: 1,
          name: "Devon",
          image: "https://avatars.dicebear.com/api/avataaars/devon.svg",
        },
        {
          id: 0,
          name: "Kookie Kat",
          image: "https://avatars.dicebear.com/api/avataaars/nami3.svg",
        },
      ],
      msgs: [
        {
          id: 0,
          msg: "Hey",
          image: "https://avatars.dicebear.com/api/avataaars/devon.svg",
        },
        {
          id: 1,
          msg: "Hey",
          image: "https://avatars.dicebear.com/api/avataaars/nami3.svg",
        },
        {
          id: 1,
          msg: "What's up",
          image: "https://avatars.dicebear.com/api/avataaars/nami3.svg",
        },
        {
          id: 0,
          msg: "Not much hbu",
          image: "https://avatars.dicebear.com/api/avataaars/devon.svg",
        },
      ],
    },
  },
};

let nextUserID = 0;
let nextBudID = 2;
// express
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cors());

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("joinRoom", (room) => {
    socket.join(room);
  });
  socket.on("chat", ({ room, msg, id }) => {
    io.to(room).emit("chat", { msg, id });
    if (!db.buds[room]) {
      db.buds[room] = { msgs: [] };
    }
    db.buds[room].msgs.push({ msg, id });
  });
});

const authenticate = (req, res, next) => {
  // check headers for id
  if (!db.users.hasOwnProperty(Number(req.header("User-Id")))) {
    res.sendStatus(401);
  } else {
    next();
  }
};

const generatePhoneCode = (phoneNumber) => {
  const code = Math.floor(Math.random() * 900000) + 100000;
  twilioClient.messages.create({
    body: `Your ChatBud authentication code is ${code}`,
    from: twilioPhoneNumber,
    to: phoneNumber,
  });
  console.log(`Sending code: ${code} to phone number: ${phoneNumber}`);
  phoneCodes[phoneNumber] = code.toString();
};

/**
 * Login route (login and sign up)
 * First sign-in will generate a code
 */
app.post("/login", (req, res) => {
  const { phone_number } = req.body;
  if (!phone_number) {
    res.status(400).send("Missing phone number");
    return;
  }

  // twilio api call
  generatePhoneCode(phone_number);
  res.status(200).json({ next_step: "code" });
});

/**
 * 2fa Route
 */
app.post("/login/2fa", (req, res) => {
  const { phone_number, code } = req.body;
  if (!code) {
    res.status(400).send("Missing code");
    return;
  }
  // send 200 if code matches, else 401
  if (code === phoneCodes[phone_number]) {
    // if user exists, redirect to /home
    // if not, redirect to /details
    const id = req.header("User-Id");
    if (db.users.hasOwnProperty(id)) {
      res.status(200).json({ redirect: "/home" });
    } else {
      res.status(200).json({ redirect: "/details" });
    }
  } else {
    res.sendStatus(401);
  }
});

/**
 * Route to create user
 */
app.post("/user/create", (req, res) => {
  if (
    !req.body.name ||
    !req.body.yearOfBirth ||
    !req.body.interests.length === 0 ||
    !req.body.avatarSeed
  ) {
    res.status(400).send("Input fields missing");
    return;
  }

  const user = {
    name: req.body.name,
    yearOfBirth: req.body.yearOfBirth,
    interests: req.body.interests,
    avatarSeed: req.body.avatarSeed,
  };

  const results = categorize(interests[0]).then((traits) => {
    user.favInterest = traits.prediction.topIntent;
  });

  db.users[nextUserID] = user;
  nextUserID++;
  res.status(200).json({ id: nextUserID - 1 });
});

app.post("/matchmake", authenticate, (req, res) => {
  // get the user id from header
  // Then find another user that has the same interests
  const userId = Number(req.header("User-Id"));
  const user = db.users[userId];

  const alreadyMatched = [];

  for (const bud in db.buds) {
    const convo = db.buds[bud];
    if (convo.users.some((user) => user.id === userId)) {
      const users = convo.users;
      let b;
      if (users[0].id === userId) {
        b = users[1].id;
      } else {
        b = users[0].id;
      }

      alreadyMatched.push(Number(b));
    }
  }

  for (let potential in db.users) {
    console.log(potential);
    if (
      Number(potential) !== userId &&
      !alreadyMatched.includes(Number(potential))
    ) {
      const potentialUser = db.users[potential];
      if (
        potentialUser.interests.some((interest) =>
          user.interests.includes(interest)
        ) ||
        potentialUser.favInterest === user.favInterest
      ) {
        db.buds[nextBudID] = {
          users: [
            {
              id: userId,
              name: user.name,
              image: user.avatarSeed,
            },
            {
              id: potential,
              name: potentialUser.name,
              image: potentialUser.avatarSeed,
            },
          ],
          msgs: [],
        };

        res.status(200).json({ debug: db.buds[nextBudID], id: nextBudID++ });
        return;
      }
    }
  }

  res.sendStatus(404); // sadge
});

/**
 * Route to update user details
 */
app.post("/user/update", authenticate, (req, res) => {});

/**
 * Route to update user phone number
 */
app.post("/user/phone", authenticate, (req, res) => {
  // Similar flow to login
  // generatePhoneCode(phone_number);
});

/**
 * Route to get current user's details (plant related?)
 */
app.get("/user", authenticate, (req, res) => {});

/**
 * Route to get a list of user's buds
 */
app.get("/buds", authenticate, (req, res) => {
  const uid = Number(req.header("User-Id"));
  const buds = [];
  for (const bud in db.buds) {
    const convo = db.buds[bud];
    if (convo.users.some((user) => user.id === uid)) {
      const users = convo.users;
      let b = {};

      if (users[0].id === uid) {
        b = users[1];
      } else {
        b = users[0];
      }
      b.id = bud;
      b.lastMessage = convo.msgs[convo.msgs.length - 1]?.msg || "";
      buds.push(b);
    }
  }
  res.status(200).json(buds);
});

/**
 * Route to get details for a user's specific bud
 */
app.get("/buds/:id", (req, res) => {
  res.json(db.buds[req.params.id]);
});

server.listen(process.env.PORT, () => {
  console.log(`listening on *:${process.env.PORT}`);
});
