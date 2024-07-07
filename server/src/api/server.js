import express from "express";
import mongoose from "mongoose";

const PORT = process.env.PORT || 3000;
const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  const { name } = req.query;
  res.send(`Hello ${name || "World"}`);
});

const start = async () => {
  try {
    console.log("Connecting to MongoDB");
    await mongoose.connect(MONGO_CONNECTION_STRING);
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

export { start };
