import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import UserModel from "./user.model";
import { faker } from "@faker-js/faker";

const mongoInMemory = await MongoMemoryServer.create();

export const connect = async () => {
  const uri = mongoInMemory.getUri();
  await mongoose.connect(uri, {});
};

export const closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoInMemory.stop();
};

export const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};

export const populateDatabase = async (quantity) => {
  for (let i = 0; i < quantity; i++) {
    const user = new UserModel({
      email: faker.internet.email(),
      name: faker.person.fullName(),
      birthDate: faker.date.past(),
    });
    await user.save();
  }
};
