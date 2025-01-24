import express from "express";
import {
  createUserHandler,
  getCurrentUser,
} from "./controllers/user.controller";
import { validateRequest } from "./middleware/validateRequest";
import { createUserSchema } from "./schemas/user.schema";
import { createSessionSchema } from "./schemas/session.schema";
import {
  createUserSessionHandler,
  deleteUserSessionHandler,
  getUserSessionHandler,
} from "./controllers/session.controller";
import { deserializeUser } from "./middleware/deserializeUser";
import { requireUser } from "./middleware/requireUser";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);

// Middleware to parse JSON bodies
app.use(express.json()); // This is required for parsing JSON bodies
app.use(deserializeUser);

app.get("/healthcheck", (_, res) => {
  res.sendStatus(200);
});

app.post("/api/users", validateRequest(createUserSchema), createUserHandler);

app.post(
  "/api/sessions",
  validateRequest(createSessionSchema),
  createUserSessionHandler
);

app.get("/api/sessions", requireUser, getUserSessionHandler);

app.delete("/api/sessions", requireUser, deleteUserSessionHandler);

app.get("/api/me", requireUser, getCurrentUser);

export default app;
