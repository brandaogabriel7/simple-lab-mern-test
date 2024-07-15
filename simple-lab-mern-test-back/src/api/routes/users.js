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

router.get("/:email", (req, res) => getUserByEmail(userService, req, res));

router.get("/", (req, res) => getUsers(userService, req, res));

router.post("/", (req, res) => createUser(userService, req, res));

router.delete("/:email", (req, res) => deleteUser(userService, req, res));

router.put("/", (req, res) => updateUser(userService, req, res));

export default router;
