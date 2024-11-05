import cookieParser from "cookie-parser";
import { createServer } from 'node:http';
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import jwt from "jsonwebtoken";
import { errorHandler, routeNotFound } from "./middlewares/errorMiddlewaves.js";
import routes from "./routes/index.js";
import db from './models/database.js';
import { Server } from "socket.io";

dotenv.config();

const PORT = process.env.PORT || 5000;
const secretKeyJWT = process.env.JWT_SECRET;

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

io.use((socket, next) => {
  cookieParser()(socket.request, socket.request.res, (err) => {
    if (err) return next(err);

    const token = socket.request.cookies.token;
    if (!token) return next(new Error("Authentication Error"));

    try {
      const decoded = jwt.verify(token, secretKeyJWT);
      socket.user = decoded;
      next();
    } catch (error) {
      next(new Error("Authentication Error"));
    }
  });
});

io.on("connection", (socket) => {
  console.log("User Connected", socket.id);

  socket.on("message", ({ room, message }) => {
    console.log({ room, message });
    socket.to(room).emit("receive-message", message);
  });

  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`User joined room ${room}`);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

app.use("/api", routes);
app.use(routeNotFound);
app.use(errorHandler);

db.sequelize.sync()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
