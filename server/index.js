import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });
  socket.on("new_user", (data) => {
    socket.to(data.room).emit("new_user", data);
    console.log(data.time);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
    console.log(data);
  });
  socket.on("exit", (data) => {
    socket.to(data.room).emit("user_exit", data);
  });

  socket.on("disconnect", () => {
    socket.to().emit("exit_user", socket.id);
    console.log("User Disconnected", socket.id);
  });
});

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});
