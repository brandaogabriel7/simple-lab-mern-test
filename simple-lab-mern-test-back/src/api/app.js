import express from "express";
import cors from "cors";
import usersRouter from "./routes/users.js";
import morganMiddleware from "./middleware/morganMiddleware.js";
import logErrors from "./middleware/logErrors.js";
import errorHandler from "./middleware/errorHandler.js";
import badRequestErrorHandler from "./middleware/badRequestErrorHandler.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use(morganMiddleware);

app.use("/api/users", usersRouter);

app.use(logErrors);
app.use(badRequestErrorHandler);
app.use(errorHandler);

export default app;
