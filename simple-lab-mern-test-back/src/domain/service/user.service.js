export default class UserService {
  #userRepository;

  constructor(userRepository) {
    this.#userRepository = userRepository;
  }

  async getUserByEmail(email) {
    return await this.#userRepository.getByEmail(email);
  }

  async getUsers() {
    return await this.#userRepository.get();
  }

  async createUser(user) {
    const existingUser = await this.#userRepository.getByEmail(user.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }
    await this.#userRepository.create(user);
  }

  async updateUser(user) {
    await this.#userRepository.update(user);
  }

  async deleteUser(email) {
    await this.#userRepository.delete(email);
  }
}
