import express from "express";
import { createUserHandler } from "./controllers/user.controller";
import { validateRequest } from "./middleware/validateRequest";
import { createUserSchema } from "./schemas/user.schema";
import { createSessionSchema } from "./schemas/session.schema";
import { createSessionHandler } from "./controllers/session.controller";

const app = express();

// Middleware to parse JSON bodies
app.use(express.json()); // This is required for parsing JSON bodies

app.get("/healthcheck", (req, res) => {
  res.sendStatus(200);
});

app.post("/api/users", validateRequest(createUserSchema), createUserHandler);

app.post(
  "/api/sessions",
  validateRequest(createSessionSchema),
  createSessionHandler
);

export default app;
