import BirthDate from "./birth-date";

describe("birth date tests", () => {
  it("should throw an error when birth date is empty", () => {
    expect(() => {
      new BirthDate();
    }).toThrow("Birth date is required");
  });

  it("should throw an error when passed string is not a valid date", () => {
    expect(() => {
      new BirthDate("test");
    }).toThrow("Invalid birth date");

    expect(() => {
      new BirthDate("23423445");
    }).toThrow("Invalid birth date");
  });

  it("should create a birth date when passed a valid date string or object", () => {
    expect(() => {
      new BirthDate(239847);
    }).toThrow("Invalid birth date");

    expect(() => {
      new BirthDate({});
    }).toThrow("Invalid birth date");
  });

  it("should throw an error when birth date is in the future", () => {
    expect(() => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      new BirthDate(futureDate);
    }).toThrow("Birth date can't be in the future");

    expect(() => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      new BirthDate(futureDate);
    }).toThrow("Birth date can't be in the future");
  });
});
