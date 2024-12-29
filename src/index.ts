import app from "./server";
import dotenv from "dotenv";
import { connect } from "./db/connect";

dotenv.config();

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
  connect();
});
