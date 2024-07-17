import morgan from "morgan";
import { getLogger } from "../../infrastructure/logger/winston/logger.js";

const morganMiddleware = morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  {
    stream: {
      write: (message) => getLogger("http-requests").http(message.trim()),
    },
  }
);

export default morganMiddleware;
