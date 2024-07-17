import morgan from "morgan";
import { getLogger } from "../../infrastructure/logger/winston/logger.js";

const customFormat = (tokens, req, res) => {
  const method = tokens.method(req, res);
  const url = tokens.url(req, res);
  const status = tokens.status(req, res);
  const contentLength = tokens.res(req, res, "content-length");
  const responseTime = tokens["response-time"](req, res);

  return JSON.stringify({
    message: `${method} ${url} ${status} ${contentLength} - ${responseTime} ms`,
    logProperties: {
      method,
      url,
      status,
      contentLength,
      responseTime: `${responseTime} ms`,
    },
  });
};

const morganMiddleware = morgan(customFormat, {
  stream: {
    write: (message) => {
      const { message: logMessage, logProperties } = JSON.parse(message);
      const logLevel = logProperties.status >= 400 ? "error" : "info";

      getLogger("http-requests").log(logLevel, logMessage, logProperties);
    },
  },
});

export default morganMiddleware;
