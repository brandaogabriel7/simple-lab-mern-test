import { getLogger } from "../../infrastructure/logger/winston/logger.js";

const logger = getLogger("default");

const logErrors = (err, req, res, next) => {
  logger.error(err);
  next(err);
};

export default logErrors;
