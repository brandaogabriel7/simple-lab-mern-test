import mongoose from "mongoose";
import UserModel from "./src/infrastructure/repository/mongodb/user.model.js";
import { faker } from "@faker-js/faker";

const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;
console.log("Inserting test data in MongoDB...\n\n");

try {
  await mongoose.connect(MONGO_CONNECTION_STRING);
  console.log("Connected to MongoDB!");

  const insertMany = async (quantity) => {
    await UserModel.insertMany(
      Array.from({ length: quantity }, () => ({
        email: faker.internet.email(),
        name: faker.person.fullName(),
        birthDate: faker.date.past().toISOString().split("T")[0],
      }))
    );
    console.log(`Inserted ${quantity} documents`);
  };

  await insertMany(1000);
  console.log("Data inserted successfully!");
} catch (err) {
  console.error("Error inserting data in MongoDB");
} finally {
  await mongoose.disconnect();
}
