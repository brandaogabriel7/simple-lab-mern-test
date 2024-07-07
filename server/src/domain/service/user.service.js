export default class UserService {
  #userRepository;

  constructor(userRepository) {
    this.#userRepository = userRepository;
  }

  async getUserByEmail(email) {
    return await this.#userRepository.find(email);
  }

  async getAllUsers() {
    return await this.#userRepository.findAll();
  }

  async createUser(user) {
    const existingUser = await this.#userRepository.find(user.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }
    await this.#userRepository.create(user);
    return user;
  }

  async updateUser(user) {
    await this.#userRepository.update(user);
  }

  async deleteUser(email) {
    await this.#userRepository.delete(email);
  }
}
