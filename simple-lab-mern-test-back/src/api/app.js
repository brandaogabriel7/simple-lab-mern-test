import express from "express";
import cors from "cors";
import usersRouter from "./routes/users.js";
import morganMiddleware from "./middleware/morganMiddleware.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use(morganMiddleware);

app.use("/api/users", usersRouter);

export default app;
