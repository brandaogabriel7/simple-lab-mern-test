import { toISODateOnlyString } from "../date-utils";

describe("date-utils tests", () => {
  it.each([
    ["2021-01-01", "2021-01-01T00:00:00.000Z"],
    ["2023-11-21", "2023-11-21T00:00:00.000Z"],
    ["2001-07-28", "2001-07-28T00:00:00.000Z"],
  ])(
    "should return the '%s' string in ISO format from the date '%s'",
    (expected, originalDate) => {
      const date = new Date(originalDate);
      const result = toISODateOnlyString(date);
      expect(result).toBe(expected);
    }
  );
});
