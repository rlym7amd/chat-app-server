import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./router";

const app = express();

app.use(
  cors({
    origin: "http://localhost:4173", //|| process.env.ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api", router);

app.get("/healthcheck", (req, res) => {
  res.sendStatus(200);
});

export default app;
