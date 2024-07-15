import * as db from "../infrastructure/repository/mongodb/db.mock";
import request from "supertest";
import app from "./app";
import { faker } from "@faker-js/faker";
import { toISODateOnlyString } from "../utils/date-utils";

describe("App integration tests", () => {
  beforeAll(async () => await db.connect());

  afterEach(async () => await db.clearDatabase());

  afterAll(async () => await db.closeDatabase());

  it("/users successful operations", async () => {
    // create first user
    const user1 = {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      birthDate: toISODateOnlyString(faker.date.past()),
    };

    let response = await request(app).post("/api/users").send(user1);

    expect(response.statusCode).toBe(201);

    // create second user
    const user2 = {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      birthDate: toISODateOnlyString(faker.date.past()),
    };

    response = await request(app).post("/api/users").send(user2);
    expect(response.statusCode).toBe(201);

    // retrieve created user by email
    response = await request(app).get(
      `/api/users/${encodeURIComponent(user1.email)}`
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({ data: user1 });

    // retrieve all users

    const query = new URLSearchParams({ page: 1, pageSize: 2 });
    const url = `/api/users?${query.toString()}`;
    response = await request(app).get(url);

    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        data: [user1, user2],
        page: 1,
        pageSize: 2,
        totalPages: 1,
      })
    );

    //delete user
    response = await request(app).delete(
      `/api/users/${encodeURIComponent(user1.email)}`
    );
    expect(response.statusCode).toBe(200);

    response = await request(app).get(
      `/api/users/${encodeURIComponent(user1.email)}`
    );
    expect(response.statusCode).toBe(404);

    // update a user
    const updatedUser = {
      email: user2.email,
      name: faker.person.fullName(),
      birthDate: toISODateOnlyString(faker.date.past()),
    };

    response = await request(app).put("/api/users").send(updatedUser);
    expect(response.statusCode).toBe(200);

    response = await request(app).get(
      `/api/users/${encodeURIComponent(user2.email)}`
    );
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({ data: updatedUser });
  });

  it("/users with filters", async () => {
    const pageSize = 10;

    const filter = {
      name: "James",
      email: "test-email",
      birthDate: {
        after: "1990-01-01",
        before: "2020-01-01",
      },
    };

    for (let i = 0; i < pageSize; i++) {
      const firstName = i % 2 === 0 ? "James" : "Allastor";
      const newUser = {
        email: `${filter.email}.${faker.internet.email()}`,
        name: `${firstName} ${faker.person.lastName()}`,
        birthDate: toISODateOnlyString(
          faker.date.between({
            from: filter.birthDate.after,
            to: filter.birthDate.before,
          })
        ),
      };

      await request(app).post("/api/users").send(newUser);
    }

    const query = new URLSearchParams({
      page: 1,
      pageSize,
      name: filter.name,
      email: filter.email,
      birthDateAfter: filter.birthDate.after,
      birthDateBefore: filter.birthDate.before,
    });

    const url = `/api/users?${query.toString()}`;
    const response = await request(app).get(url);

    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        page: 1,
        pageSize,
        totalPages: 1,
      })
    );
    expect(response.body.data.length).toBe(pageSize / 2);
    for (let user of response.body.data) {
      expect(user.name).toContain(filter.name);
      expect(user.email).toContain(filter.email);
      const birthDateObj = new Date(user.birthDate);
      const birthDateAfter = new Date(filter.birthDate.after);
      const birthDateBefore = new Date(filter.birthDate.before);
      expect(birthDateObj.getTime()).toBeGreaterThanOrEqual(
        birthDateAfter.getTime()
      );
      expect(birthDateObj.getTime()).toBeLessThanOrEqual(
        birthDateBefore.getTime()
      );
    }
  });

  it("/users not found errors", async () => {
    // trying to retrieve non-existing user
    let response = await request(app).get(
      `/api/users/${encodeURIComponent(faker.internet.email())}`
    );
    expect(response.statusCode).toBe(404);

    // trying to get deleted user
    const user = {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      birthDate: toISODateOnlyString(faker.date.past()),
    };

    response = await request(app).post("/api/users").send(user);
    expect(response.statusCode).toBe(201);

    response = await request(app).delete(
      `/api/users/${encodeURIComponent(user.email)}`
    );
    expect(response.statusCode).toBe(200);

    response = await request(app).get(
      `/api/users/${encodeURIComponent(user.email)}`
    );
    expect(response.statusCode).toBe(404);
  });

  it("/users bad request errors", async () => {
    // trying to create user with repeated email
    const user = {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      birthDate: toISODateOnlyString(faker.date.past()),
    };

    let response = await request(app).post("/api/users").send(user);
    expect(response.statusCode).toBe(201);

    const otherUser = {
      email: user.email,
      name: faker.person.fullName(),
      birthDate: toISODateOnlyString(faker.date.past()),
    };

    response = await request(app).post("/api/users").send(otherUser);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("User with this email already exists");
  });
});
