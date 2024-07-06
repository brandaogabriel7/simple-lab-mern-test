import UserModel from "./user.model";
import User from "../../../domain/entity/user";
import BirthDate from "../../../domain/value-object/birth-date";

const userDto = (user) => ({
  email: user.email,
  name: user.name,
  birthDate: user.birthDate.value,
});

export default class UserRepository {
  async create(user) {
    const newUser = new UserModel(userDto(user));
    await newUser.save();
  }

  async update(user) {
    const existingUser = await UserModel.findOne({ email: user.email });
    if (!existingUser) {
      throw new Error("User not found");
    }
    await UserModel.updateOne({ email: user.email }, userDto(user));
  }

  async delete(email) {
    await UserModel.deleteOne({ email });
  }

  async find(email) {
    const user = await UserModel.findOne({ email });
    return new User(user.email, user.name, new BirthDate(user.birthDate));
  }

  async findAll() {
    const users = await UserModel.find();
    return users.map(
      (user) => new User(user.email, user.name, new BirthDate(user.birthDate))
    );
  }
}
