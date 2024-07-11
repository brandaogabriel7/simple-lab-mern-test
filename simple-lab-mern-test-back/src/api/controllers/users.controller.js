import { Router } from "express";
import User from "../../domain/entity/user.js";
import BirthDate from "../../domain/value-object/birth-date.js";
const userRouter = (userService) => {
  const router = Router();

  router.get("/:email", async (req, res) => {
    const encodedEmail = req.params.email;
    const email = decodeURIComponent(encodedEmail);
    const user = await userService.getUserByEmail(email);
    if (!user) {
      res.status(404).send();
      return;
    }
    res.json({
      email: user.email,
      name: user.name,
      birthDate: user.birthDate.value,
    });
  });

  router.get("/", async (_, res) => {
    const users = await userService.getUsers();
    res.json(
      users.map((user) => ({
        email: user.email,
        name: user.name,
        birthDate: user.birthDate.value.toISOString(),
      }))
    );
  });

  router.post("/", async (req, res) => {
    const user = req.body;
    const userEntity = new User(
      user.email,
      user.name,
      new BirthDate(user.birthDate)
    );
    try {
      await userService.createUser(userEntity);
    } catch (err) {
      if (err.message === "User with this email already exists") {
        res.status(400).send({ message: err.message });
        return;
      }
      throw err;
    }
    res.status(201).send();
  });

  router.delete("/:email", async (req, res) => {
    const encodedEmail = req.params.email;
    const email = decodeURIComponent(encodedEmail);
    await userService.deleteUser(email);
    res.send();
  });

  router.put("/", async (req, res) => {
    const user = req.body;
    const userEntity = new User(
      user.email,
      user.name,
      new BirthDate(user.birthDate)
    );
    try {
      await userService.updateUser(userEntity);
    } catch (error) {
      if (error.message === "User not found") {
        res.status(404).send();
        return;
      }
      throw error;
    }
    res.send();
  });
  return router;
};

export default userRouter;
