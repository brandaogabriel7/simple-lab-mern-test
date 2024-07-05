export default class User {
  #email;
  #name;
  #birthDate;

  constructor(email, name, birthDate) {
    this.#email = email;
    this.#name = name;
    this.#birthDate = birthDate;

    this.#validate();
  }

  #validate() {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+/;

    if (!this.#email) {
      throw new Error("Email is required");
    }

    if (!emailPattern.test(this.#email)) {
      throw new Error("Invalid email");
    }

    if (!this.#name) {
      throw new Error("Name is required");
    }

    if (!this.#birthDate) {
      throw new Error("Birth date is required");
    }
  }

  get email() {
    return this.#email;
  }

  get name() {
    return this.#name;
  }

  get birthDate() {
    return this.#birthDate;
  }

  changeName(name) {
    this.#name = name;
    this.#validate();
  }

  changeBirthDate(birthDate) {
    this.#birthDate = birthDate;
    this.#validate();
  }
}
