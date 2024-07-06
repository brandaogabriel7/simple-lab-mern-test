export default class BirthDate {
  #value;

  constructor(value) {
    this.#value = value;

    this.#validate();
  }

  #validate() {
    if (!this.#value) {
      throw new Error("Birth date is required");
    }
    if (typeof this.#value === "string") {
      const datePattern = /^\d{4}-\d{2}-\d{2}$/;
      if (!datePattern.test(this.#value)) {
        throw new Error("Invalid birth date");
      }
      this.#value = new Date(this.#value);
    } else if (!(this.#value instanceof Date)) {
      throw new Error("Invalid birth date");
    }

    if (this.#value > new Date()) {
      throw new Error("Birth date can't be in the future");
    }
  }

  get value() {
    return this.#value;
  }
}
