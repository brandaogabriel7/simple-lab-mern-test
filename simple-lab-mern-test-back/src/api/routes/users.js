import express from "express";
import UserService from "../../domain/service/user.service.js";
import UserRepository from "../../infrastructure/repository/mongodb/user.repository.js";
import {
  getUserByEmail,
  getUsers,
  createUser,
  deleteUser,
  updateUser,
} from "../controllers/users.controller.js";

const router = express.Router();
const userService = new UserService(new UserRepository());

router.get("/:email", (req, res, next) =>
  getUserByEmail(userService, req, res).catch(next)
);

router.get("/", (req, res, next) =>
  getUsers(userService, req, res).catch(next)
);

router.post("/", (req, res, next) =>
  createUser(userService, req, res).catch(next)
);

router.delete("/:email", (req, res, next) =>
  deleteUser(userService, req, res).catch(next)
);

router.put("/", (req, res, next) =>
  updateUser(userService, req, res).catch(next)
);

export default router;
