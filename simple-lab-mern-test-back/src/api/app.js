import express from "express";
import usersController from "./controllers/users.controller.js";
import UserRepository from "../infrastructure/repository/mongodb/user.repository.js";
import UserService from "../domain/service/user.service.js";
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/users", usersController(new UserService(new UserRepository())));

export default app;
