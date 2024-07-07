import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  const { name } = req.query;
  res.send(`Hello ${name || "World"}`);
});

export default app;
