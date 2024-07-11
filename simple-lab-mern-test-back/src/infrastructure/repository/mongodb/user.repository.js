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
    await UserModel.findOneAndUpdate(
      { email: user.email },
      {
        email: user.email,
        name: user.name,
        birthDate: user.birthDate.value,
      }
    ).exec();
  }

  async delete(email) {
    await UserModel.deleteOne({ email }).exec();
  }

  async getByEmail(email) {
    const user = await UserModel.findOne({ email }).lean().exec();
    if (!user) {
      return null;
    }
    return new User(user.email, user.name, new BirthDate(user.birthDate));
  }

  async get(page, pageSize) {
    const $skip = pageSize * (page - 1);
    const users = await UserModel.find(
      {},
      {},
      {
        skip: $skip,
        limit: pageSize,
      }
    )
      .lean()
      .exec();

    const totalUsers = await UserModel.countDocuments().exec();
    const totalPages = Math.ceil(totalUsers / pageSize);
    return {
      users: users.map(
        (user) => new User(user.email, user.name, new BirthDate(user.birthDate))
      ),
      pageInfo: {
        page,
        pageSize,
        totalPages,
      },
    };
  }
}
