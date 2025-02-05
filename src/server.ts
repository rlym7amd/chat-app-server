import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.get("/healthcheck", (req, res) => {
  res.sendStatus(200);
});

export default app;
