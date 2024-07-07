import User from "./user";
import BirthDate from "../value-object/birth-date";

describe("user tests", () => {
  it("should throw an error when email is empty", () => {
    expect(() => {
      new User();
    }).toThrow("Email is required");
  });

  it("should throw an error when email is invalid", () => {
    expect(() => {
      new User("test.com");
    }).toThrow("Invalid email");

    expect(() => {
      new User("test@test");
    }).toThrow("Invalid email");

    expect(() => {
      new User("test@test.");
    }).toThrow("Invalid email");
  });

  it("should throw an error when name is empty", () => {
    expect(() => {
      new User("test@test.com");
    }).toThrow("Name is required");
  });

  it("should create a user when all data is valid", () => {
    const birthDate = new BirthDate("1996-03-04");
    const user = new User("test@test.com", "Allastor", birthDate);

    expect(user).toBeInstanceOf(User);
    expect(user.email).toBe("test@test.com");
    expect(user.name).toBe("Allastor");
    expect(user.birthDate).toBe(birthDate);

    const birthDate2 = new BirthDate("1999-11-04");
    const user2 = new User("test2@test.com", "Charlie", birthDate2);

    expect(user2).toBeInstanceOf(User);
    expect(user2.email).toBe("test2@test.com");
    expect(user2.name).toBe("Charlie");
    expect(user2.birthDate).toBe(birthDate2);
  });

  it("should throw an error when trying to change to empty name", () => {
    const birthDate = new BirthDate("1996-03-04");
    const user = new User("test@test.com", "Allastor", birthDate);

    expect(() => {
      user.changeName();
    }).toThrow("Name is required");

    expect(() => {
      user.changeName("");
    }).toThrow("Name is required");
  });

  it("should change name", () => {
    const birthDate = new BirthDate("1996-03-04");
    const user = new User("test@test.com", "Allastor", birthDate);

    expect(user.name).toBe("Allastor");
    user.changeName("Adam");
    expect(user.name).toBe("Adam");
  });

  it("should throw an error when birth date is empty", () => {
    const birthDate = new BirthDate("1996-03-04");
    const user = new User("test@test.com", "Allastor", birthDate);

    expect(() => {
      user.changeBirthDate();
    }).toThrow("Birth date is required");

    expect(() => {
      user.changeBirthDate(null);
    }).toThrow("Birth date is required");

    expect(() => {
      user.changeBirthDate("");
    }).toThrow("Birth date is required");
  });

  it("should change birth date", () => {
    const birthDate = new BirthDate("1996-03-04");
    const user = new User("test@test.com", "Allastor", birthDate);

    expect(user.birthDate).toBe(birthDate);
    const newBirthDate = new BirthDate("1999-11-04");
    user.changeBirthDate(newBirthDate);
    expect(user.birthDate).toBe(newBirthDate);
  });
});
