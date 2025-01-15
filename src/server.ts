import express from "express";
import { createUserHandler } from "./controllers/user.controller";
import { validateRequest } from "./middleware/validateRequest";
import { createUserSchema } from "./schemas/user.schema";
import { createSessionSchema } from "./schemas/session.schema";
import {
  createUserSessionHandler,
  getUserSessionHandler,
} from "./controllers/session.controller";
import { deserializeUser } from "./middleware/deserializeUser";
import { requireUser } from "./middleware/requireUser";

const app = express();

// Middleware to parse JSON bodies
app.use(express.json()); // This is required for parsing JSON bodies
app.use(deserializeUser);

app.get("/healthcheck", (req, res) => {
  res.sendStatus(200);
});

app.post("/api/users", validateRequest(createUserSchema), createUserHandler);

app.post(
  "/api/sessions",
  validateRequest(createSessionSchema),
  createUserSessionHandler
);

app.get("/api/sessions", requireUser, getUserSessionHandler);

export default app;
