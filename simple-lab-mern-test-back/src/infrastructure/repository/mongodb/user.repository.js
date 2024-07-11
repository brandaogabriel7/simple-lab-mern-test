import UserModel from "./user.model.js";
import User from "../../../domain/entity/user.js";
import BirthDate from "../../../domain/value-object/birth-date.js";

export default class UserRepository {
  async create(user) {
    const newUser = new UserModel({
      email: user.email,
      name: user.name,
      birthDate: user.birthDate.value,
    });
    await newUser.save();
  }

  async update(user) {
    const existingUser = await UserModel.findOne({ email: user.email }).lean();
    if (!existingUser) {
      throw new Error("User not found");
    }
    await UserModel.updateOne(
      { email: user.email },
      {
        email: user.email,
        name: user.name,
        birthDate: user.birthDate.value,
      }
    );
  }

  async delete(email) {
    await UserModel.deleteOne({ email });
  }

  async getByEmail(email) {
    const user = await UserModel.findOne({ email }).lean();
    if (!user) {
      return null;
    }
    return new User(user.email, user.name, new BirthDate(user.birthDate));
  }

  async get(page, pageSize) {
    const $skip = pageSize * (page - 1);
    const users = await UserModel.find().lean().skip($skip).limit(pageSize);
    return {
      users: users.map(
        (user) => new User(user.email, user.name, new BirthDate(user.birthDate))
      ),
      pageInfo: {
        page,
        pageSize,
        totalPages: Math.ceil((await UserModel.countDocuments()) / pageSize),
      },
    };
  }
}
