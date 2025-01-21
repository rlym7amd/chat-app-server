import app from "./server";
import dotenv from "dotenv";
import { connect } from "./db/connect";
import { log } from "./logger";

dotenv.config();

const port = process.env.PORT || 1337;

app.listen(port, async () => {
  log.info(`Server is listening at port ${port}`);
  await connect();
});
