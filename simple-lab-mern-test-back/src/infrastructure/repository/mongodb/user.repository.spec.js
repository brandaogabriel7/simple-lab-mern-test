import UserRepository from "./user.repository";
import * as db from "./db.mock";
import User from "../../../domain/entity/user";
import BirthDate from "../../../domain/value-object/birth-date";
import UserModel from "./user.model";
import { toISODateOnlyString } from "../../../utils/date-utils";
import { faker } from "@faker-js/faker";

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
    expect(toISODateOnlyString(createdUser.birthDate)).toStrictEqual(
      user.birthDate.value
    );
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
    expect(toISODateOnlyString(updatedUser.birthDate)).toStrictEqual(
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
    expect(toISODateOnlyString(createdUser.birthDate)).toStrictEqual(
      user.birthDate.value
    );
  });

  it("should return null when trying to find user that does not exist", async () => {
    const email = "doesnotexist@test.com";

    const user = await userRepository.getByEmail(email);

    expect(user).toBeNull();
  });

  it("should get users", async () => {
    const pageSize = 10;
    const totalPages = 10;

    const operations = Array.from({ length: totalPages }, () => {
      return db.populateDatabase(pageSize);
    });
    await Promise.all(operations);

    for (let i = 0; i < totalPages; i++) {
      const { users, pageInfo } = await userRepository.get(i + 1, pageSize);

      expect(users.length).toBe(pageSize);
      expect(pageInfo).toStrictEqual({ page: i + 1, pageSize, totalPages });
    }
  });

  it("should get users with filter", async () => {
    const pageSize = 10;
    const filter = { name: "James", email: "test-email" };

    for (let i = 0; i < pageSize; i++) {
      const firstName = i % 2 === 0 ? "James" : "Allastor";
      const newUser = new UserModel({
        email: `${filter.email}.${faker.internet.email()}`,
        name: `${firstName} ${faker.person.lastName()}`,
        birthDate: faker.date.past(),
      });
      await newUser.save();
    }

    const response = await userRepository.get(1, pageSize, filter);
    expect(response.users.length).toBe(pageSize / 2);
    for (let user of response.users) {
      expect(user.name).toContain(filter.name);
      expect(user.email).toContain(filter.email);
    }
    expect(response.pageInfo).toStrictEqual({
      page: 1,
      pageSize,
      totalPages: 1,
    });
    expect(response.filter).toStrictEqual(filter);

    // filter by email
    const emailFilter = "test-email2";
    for (let i = 0; i < pageSize; i++) {
      const newUser = new UserModel({
        email: `${emailFilter}.${faker.internet.email()}`,
        name: faker.person.fullName(),
        birthDate: faker.date.past(),
      });
      await newUser.save();
    }

    const emailResponse = await userRepository.get(1, pageSize, {
      email: emailFilter,
    });

    expect(emailResponse.users.length).toBe(pageSize);
    for (let user of emailResponse.users) {
      expect(user.email).toContain(emailFilter);
    }
    expect(emailResponse.pageInfo).toStrictEqual({
      page: 1,
      pageSize,
      totalPages: 1,
    });

    // filter by birthDate
    const birthDateFilter = {
      before: "1993-01-02",
      after: "1990-01-02",
    };

    for (let i = 0; i < pageSize; i++) {
      const newUser = new UserModel({
        email: faker.internet.email(),
        name: faker.person.fullName(),
        birthDate: faker.date.between({
          from: birthDateFilter.after,
          to: birthDateFilter.before,
        }),
      });
      await newUser.save();
    }

    const birthDateResponse = await userRepository.get(1, pageSize, {
      birthDate: birthDateFilter,
    });
    expect(birthDateResponse.users.length).toBe(pageSize);
    for (let user of birthDateResponse.users) {
      const birthDateObj = new Date(user.birthDate.value);
      expect(birthDateObj.getTime()).toBeLessThanOrEqual(
        new Date(birthDateFilter.before).getTime()
      );
      expect(birthDateObj.getTime()).toBeGreaterThanOrEqual(
        new Date(birthDateFilter.after).getTime()
      );
    }
    expect(birthDateResponse.pageInfo).toStrictEqual({
      page: 1,
      pageSize,
      totalPages: 1,
    });
    expect(birthDateResponse.filter).toStrictEqual({
      birthDate: birthDateFilter,
    });

    // filter by all fields
    const allFilter = {
      name: "James",
      email: "test-email",
      birthDate: {
        before: "1993-01-02",
        after: "1990-01-02",
      },
    };

    for (let i = 0; i < pageSize; i++) {
      const newUser = new UserModel({
        email: `${allFilter.email}.${faker.internet.email()}`,
        name: `${allFilter.name} ${faker.person.lastName()}`,
        birthDate: faker.date.between({
          from: allFilter.birthDate.after,
          to: allFilter.birthDate.before,
        }),
      });
      await newUser.save();
    }

    const allResponse = await userRepository.get(1, pageSize, allFilter);

    expect(allResponse.users.length).not.toBe(0);
    for (let user of allResponse.users) {
      expect(user.name).toContain(allFilter.name);
      expect(user.email).toContain(allFilter.email);
      const birthDateObj = new Date(user.birthDate.value);
      expect(birthDateObj.getTime()).toBeLessThanOrEqual(
        new Date(allFilter.birthDate.before).getTime()
      );
      expect(birthDateObj.getTime()).toBeGreaterThanOrEqual(
        new Date(allFilter.birthDate.after).getTime()
      );
    }
    expect(allResponse.pageInfo).toStrictEqual({
      page: 1,
      pageSize,
      totalPages: 1,
    });
    expect(allResponse.filter).toStrictEqual(
      expect.objectContaining(allFilter)
    );
  });
});
