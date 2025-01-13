import logger from "pino";
import pretty from "pino-pretty";

export const log = logger(
  pretty({
    ignore: "pid,hostname",
  })
);
