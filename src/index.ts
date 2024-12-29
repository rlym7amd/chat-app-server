import app from "./server";
import dotenv from "dotenv";
import { connect } from "./db/connect";
import { log } from "./logger";

dotenv.config();

const port = process.env.PORT || 8000;

app.listen(port, () => {
  log.info(`Server is listening at port ${port}`);
  connect();
});
