import app from "./src/api/app.js";
import mongoose from "mongoose";

const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;
const PORT = process.env.PORT || 3000;

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
