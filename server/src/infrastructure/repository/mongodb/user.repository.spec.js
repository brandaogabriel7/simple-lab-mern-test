import UserRepository from "./user.repository";
import * as db from "./db.mock";
import User from "../../../domain/entity/user";
import BirthDate from "../../../domain/value-object/birth-date";
import UserModel from "./user.model";

let userRepository;
beforeAll(async () => {
  await db.connect();
  userRepository = new UserRepository();
});

afterEach(async () => await db.clearDatabase());

afterAll(async () => await db.closeDatabase());

describe("UserRepository tests", () => {
  it("should create a user", async () => {
    const birthDate = new BirthDate("1993-01-02");
    const user = new User("test@test.com", "Allastor", birthDate);

    await userRepository.create(user);

    const createdUser = await UserModel.findOne({ email: user.email });
    expect(createdUser.email).toBe(user.email);
    expect(createdUser.name).toBe(user.name);
    expect(createdUser.birthDate).toStrictEqual(user.birthDate.value);
  });

  it("should throw an error when trying to update a user that does not exist", async () => {
    await expect(async () => {
      const birthDate = new BirthDate("1993-01-02");
      const user = new User("test@test.com", "Allastor", birthDate);

      await userRepository.update(user);
    }).rejects.toThrow("User not found");
  });

  it("should update a user", async () => {
    const birthDate = new BirthDate("1993-01-02");
    const user = new User("test@test.com", "Allastor", birthDate);

    await userRepository.create(user);

    user.changeName("James");
    user.changeBirthDate(new BirthDate("1990-01-02"));

    await userRepository.update(user);

    let updatedUser = await UserModel.findOne({ email: user.email });
    expect(updatedUser.email).toBe(user.email);
    expect(updatedUser.name).toBe(user.name);
    expect(updatedUser.birthDate).toStrictEqual(user.birthDate.value);
  });

  it("should delete a user", async () => {
    const birthDate = new BirthDate("1993-01-02");
    const user = new User("test@test.com", "Allastor", birthDate);

    await userRepository.create(user);

    const createdUser = await UserModel.findOne({ email: user.email });
    expect(createdUser).not.toBeNull();

    await userRepository.delete(user.email);

    const deletedUser = await UserModel.findOne({ email: user.email });
    expect(deletedUser).toBeNull();
  });

  it("should find a user by email", async () => {
    const birthDate = new BirthDate("1993-01-02");
    const user = new User("test@test.com", "Allastor", birthDate);

    await userRepository.create(user);

    const createdUser = await userRepository.find(user.email);

    expect(createdUser.email).toBe(user.email);
    expect(createdUser.name).toBe(user.name);
    expect(createdUser.birthDate.value).toStrictEqual(user.birthDate.value);
  });

  it("should find all users", async () => {
    await db.populateDatabase(10);

    const users = await userRepository.findAll();

    expect(users.length).toBe(10);
  });
});
