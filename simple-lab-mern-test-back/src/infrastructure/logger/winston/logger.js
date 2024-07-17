import * as winston from "winston";
const { combine, timestamp, json, errors } = winston.format;

const defaultMeta = {
  service: "user-service",
  machine: process.env.NAME || "local",
};

winston.loggers.add("default", {
  level: process.env.LOG_LEVEL || "info",
  format: combine(errors({ stack: true }), timestamp(), json()),
  defaultMeta,
  transports: [new winston.transports.Console()],
});

winston.loggers.add("http-requests", {
  level: process.env.LOG_LEVEL || "info",
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }), json()),
  defaultMeta,
  transports: [new winston.transports.Console()],
});

const getLogger = (label) => winston.loggers.get(label);

export { getLogger };
