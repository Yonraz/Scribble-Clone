import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);
const PORT = 5000;

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.on("clear-canvas", () => {
    socket.broadcast.emit("set-clear-canvas");
  });
  socket.on("start-draw", (data) => {
    socket.broadcast.emit("user-started-drawing", data);
  });
  socket.on("user-move", (data) => {
    socket.broadcast.emit("user-mousemove", data);
  });
  socket.on("stop-draw", () => {
    socket.broadcast.emit("user-stopped-drawing");
  });
  socket.on("user-flood-fill", (data) => {
    socket.broadcast.emit("user-flood-fill", data);
  });
});
app.get("/", (req, res) => {
  res.status(200).send();
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
