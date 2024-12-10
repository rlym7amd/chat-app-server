import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get("/healthcheck", (req, res) => {
  res.status(200).send("ok\n");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
