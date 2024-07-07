import { Router } from "express";

const userRouter = (userService) => {
  const router = Router();
  router.get("/", async (_, res) => {
    const users = await userService.getAll();
    res.json(users);
  });
  return router;
};

export default userRouter;
