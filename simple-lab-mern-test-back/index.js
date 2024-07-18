import app from "./src/api/app.js";
import mongoose from "mongoose";
import { getLogger } from "./src/infrastructure/logger/winston/logger.js";

const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;
const PORT = process.env.PORT || 8080;

const logger = getLogger("default");

try {
  logger.info("Connecting to MongoDB");
  await mongoose.connect(MONGO_CONNECTION_STRING);
  logger.info("Connected to MongoDB");

  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
} catch (error) {
  logger.error(error);
}
