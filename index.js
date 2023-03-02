import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Server } from "socket.io";

import userRoutes from "./routes/userRoutes.js";
import messagesRoutes from "./routes/messagesRoute.js";

dotenv.config();
const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log(err.messaeg);
  });

app.use("/api/auth", userRoutes);
app.use("/api/messages", messagesRoutes);

const server = app.listen(process.env.PORT, () => {
  console.log("running");
});

const io = new Server(server, {
  cors: {
    origin: "https://chit-chat-fizan.netlify.app",
    credentials: true,
  },
});
global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatsockets = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.message);
    }
  });
});
