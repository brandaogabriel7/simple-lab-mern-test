import { faker } from "@faker-js/faker";
import UserService from "./user.service";
import { jest } from "@jest/globals";
import User from "../entity/user";
import BirthDate from "../value-object/birth-date";

describe("UserService tests", () => {
  const userRepository = {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    find: jest.fn(),
    findAll: jest.fn(),
  };
  const userService = new UserService(userRepository);

  it("should get user by email", async () => {
    const user = new User(
      faker.internet.email(),
      faker.person.fullName(),
      new BirthDate(faker.date.past())
    );

    userRepository.find.mockImplementation((email) => {
      if (email === user.email) {
        return Promise.resolve(user);
      }
      return Promise.resolve(null);
    });

    const foundUser = await userService.getUserByEmail(user.email);

    expect(foundUser).not.toBeNull();
    expect(foundUser.email).toBe(user.email);
    expect(foundUser.name).toBe(user.name);
    expect(foundUser.birthDate).toStrictEqual(user.birthDate);
  });

  it("should create a user", async () => {
    const user = new User(
      faker.internet.email(),
      faker.person.fullName(),
      new BirthDate(faker.date.past())
    );

    userRepository.find.mockResolvedValue(null);

    await userService.createUser(user);

    expect(userRepository.create).toHaveBeenCalledWith(user);
  });

  it("should get all users", async () => {
    const users = [];
    for (let i = 0; i < 10; i++) {
      const user = new User(
        faker.internet.email(),
        faker.person.fullName(),
        new BirthDate(faker.date.past())
      );
      users.push(user);
    }

    userRepository.findAll.mockResolvedValue(users);

    const foundUsers = await userService.getAllUsers();

    expect(foundUsers).not.toBeNull();
    expect(foundUsers.length).toBe(users.length);
    for (let foundUser in foundUsers) {
      expect(foundUser.email).toBe(users.email);
      expect(foundUser.name).toBe(users.name);
      expect(foundUser.birthDate).toStrictEqual(users.birthDate);
    }
  });

  it("should throw an error when trying to create a user with repeated email", async () => {
    const existingUser = new User(
      faker.internet.email(),
      faker.person.fullName(),
      new BirthDate(faker.date.past())
    );

    userRepository.find.mockImplementation((email) => {
      if (email !== existingUser.email) {
        return Promise.reject(null);
      }
      return Promise.resolve(existingUser);
    });

    const newUser = new User(
      existingUser.email,
      faker.person.fullName(),
      new BirthDate(faker.date.past())
    );

    await expect(async () => {
      await userService.createUser(newUser);
    }).rejects.toThrow("User with this email already exists");
  });

  it("should update a user", async () => {
    const updatedUser = new User(
      faker.internet.email(),
      faker.person.fullName(),
      new BirthDate(faker.date.past())
    );

    await userService.updateUser(updatedUser);

    expect(userRepository.update).toHaveBeenCalledTimes(1);
    expect(userRepository.update).toHaveBeenCalledWith(updatedUser);
  });

  it("should delete a user", async () => {
    const user = new User(
      faker.internet.email(),
      faker.person.fullName(),
      new BirthDate(faker.date.past())
    );

    await userService.deleteUser(user.email);

    expect(userRepository.delete).toHaveBeenCalledTimes(1);
    expect(userRepository.delete).toHaveBeenCalledWith(user.email);
  });
});
