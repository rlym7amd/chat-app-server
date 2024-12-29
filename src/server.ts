import express from "express";

const app = express();

// Middleware to parse JSON bodies
app.use(express.json()); // This is required for parsing JSON bodies

app.post("/health", (req, res) => {
  res.status(200).send("ok");
});

export default app;
