import app from "./server";
import dotenv from "dotenv";
import { connect } from "./db";
import { log } from "./logger";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow all origins for development
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  // Listen for joining a conversation
  socket.on("join conversation", (conversationId) => {
    socket.join(conversationId);
    console.log(`User joined conversation: ${conversationId}`);
  });

  // Listen for leaving a conversation
  socket.on("leave conversation", (conversationId) => {
    socket.leave(conversationId);
    console.log(`User leaved conversation: ${conversationId}`);
  });

  // Listen for chat messages
  socket.on("chat message", (msg) => {
    // Emit the message to the specific room (conversation)
    io.to(msg.conversationId).emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const port = process.env.PORT || 1337;

httpServer.listen(port, async () => {
  log.info(`Server is listening at port ${port}`);
  await connect();
});
