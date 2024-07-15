import { faker } from "@faker-js/faker";
import UserService from "./user.service";
import { jest } from "@jest/globals";
import User from "../entity/user";
import BirthDate from "../value-object/birth-date";
import { toISODateOnlyString } from "../../utils/date-utils";

describe("UserService tests", () => {
  const userRepository = {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    getByEmail: jest.fn(),
    get: jest.fn(),
  };
  const userService = new UserService(userRepository);

  afterEach(() => jest.clearAllMocks());

  it("should get user by email", async () => {
    const user = new User(
      faker.internet.email(),
      faker.person.fullName(),
      new BirthDate(faker.date.past())
    );

    userRepository.getByEmail.mockImplementation((email) => {
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

    userRepository.getByEmail.mockResolvedValue(null);

    await userService.createUser(user);

    expect(userRepository.create).toHaveBeenCalledWith(user);
  });

  it("should get users", async () => {
    const responses = Array.from({ length: 5 }, (_, index) => {
      return {
        users: Array.from({ length: 10 }, () => {
          return new User(
            faker.internet.email(),
            faker.person.fullName(),
            new BirthDate(faker.date.past())
          );
        }),
        pageInfo: { page: index + 1, pageSize: 10, totalPages: 5 },
      };
    });

    userRepository.get.mockImplementation((page, _) => {
      return Promise.resolve(
        responses.find((response) => response.pageInfo.page === page)
      );
    });

    for (let page in responses) {
      const response = await userService.getUsers(
        responses[page].pageInfo.page,
        responses[page].pageInfo.pageSize
      );

      expect(userRepository.get).toHaveBeenCalledWith(
        responses[page].pageInfo.page,
        responses[page].pageInfo.pageSize,
        expect.objectContaining({})
      );

      expect(response).toEqual(responses[page]);
    }
  });

  it("should get users with filters", async () => {
    const pageSize = 10;
    const filter = {
      name: "James",
      email: "test-email",
      birthDate: {
        before: "2001-01-01",
        after: "2020-01-01",
      },
    };
    const users = Array.from({ length: pageSize }, () => {
      return new User(
        `${filter.email}.${faker.internet.email()}`,
        `${filter.name} ${faker.person.lastName()}`,
        new BirthDate(faker.date.past())
      );
    });

    const expectedResponse = {
      pageInfo: { page: 1, totalPages: 1, pageSize },
      users,
      filter,
    };

    userRepository.get.mockResolvedValueOnce(expectedResponse);

    const response = await userService.getUsers(
      expectedResponse.pageInfo.page,
      expectedResponse.pageInfo.pageSize,
      {
        name: filter.name,
        email: filter.email,
        birthDateBefore: filter.birthDate.before,
        birthDateAfter: filter.birthDate.after,
      }
    );

    expect(userRepository.get).toHaveBeenCalledWith(
      expectedResponse.pageInfo.page,
      expectedResponse.pageInfo.pageSize,
      expectedResponse.filter
    );

    expect(response).toEqual(expectedResponse);
  });

  it("should throw an error when trying to create a user with repeated email", async () => {
    const existingUser = new User(
      faker.internet.email(),
      faker.person.fullName(),
      new BirthDate(faker.date.past())
    );

    userRepository.getByEmail.mockImplementation((email) => {
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
