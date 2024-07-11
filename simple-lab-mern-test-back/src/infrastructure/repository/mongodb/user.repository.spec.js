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

    const createdUser = await UserModel.findOne({ email: user.email })
      .lean()
      .exec();
    expect(createdUser.email).toBe(user.email);
    expect(createdUser.name).toBe(user.name);
    expect(createdUser.birthDate.toISOString().split("T")[0]).toStrictEqual(
      user.birthDate.value
    );
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

    let updatedUser = await UserModel.findOne({ email: user.email })
      .lean()
      .exec();
    expect(updatedUser.email).toBe(user.email);
    expect(updatedUser.name).toBe(user.name);
    expect(updatedUser.birthDate.toISOString().split("T")[0]).toStrictEqual(
      user.birthDate.value
    );
  });

  it("should delete a user", async () => {
    const birthDate = new BirthDate("1993-01-02");
    const user = new User("test@test.com", "Allastor", birthDate);

    await userRepository.create(user);

    const createdUser = await UserModel.findOne({ email: user.email })
      .lean()
      .exec();
    expect(createdUser).not.toBeNull();

    await userRepository.delete(user.email);

    const deletedUser = await UserModel.findOne({ email: user.email })
      .lean()
      .exec();
    expect(deletedUser).toBeNull();
  });

  it("should find a user by email", async () => {
    const birthDate = new BirthDate("1993-01-02");
    const user = new User("test@test.com", "Allastor", birthDate);

    await userRepository.create(user);

    const createdUser = await UserModel.findOne({ email: user.email })
      .lean()
      .exec();

    expect(createdUser.email).toBe(user.email);
    expect(createdUser.name).toBe(user.name);
    expect(createdUser.birthDate.toISOString().split("T")[0]).toStrictEqual(
      user.birthDate.value
    );
  });

  it("should return null when trying to find user that does not exist", async () => {
    const email = "doesnotexist@test.com";

    const user = await userRepository.getByEmail(email);

    expect(user).toBeNull();
  });

  it("should get users", async () => {
    const expectedPageInfo = {
      page: 1,
      pageSize: 10,
      totalPages: 1,
    };

    await db.populateDatabase(expectedPageInfo.pageSize);

    const { users, pageInfo } = await userRepository.get(
      expectedPageInfo.page,
      expectedPageInfo.pageSize
    );

    expect(users.length).toBe(expectedPageInfo.pageSize);
    expect(pageInfo).toStrictEqual(expectedPageInfo);
  });
});
