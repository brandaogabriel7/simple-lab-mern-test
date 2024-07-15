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

  async get(page, pageSize, filter) {
    const $skip = pageSize * (page - 1);

    const queryFilters = this.#buildQueryFilters(filter);

    const users = await UserModel.find(
      queryFilters,
      {},
      {
        skip: $skip,
        limit: pageSize,
      }
    )
      .lean()
      .exec();

    const totalPages = await this.#calculateTotalPages(queryFilters, pageSize);
    return {
      users: users.map(
        (user) => new User(user.email, user.name, new BirthDate(user.birthDate))
      ),
      pageInfo: {
        page,
        pageSize,
        totalPages,
      },
      filter,
    };
  }

  async #calculateTotalPages(queryFilters, pageSize) {
    const totalUsersWithFilter = await UserModel.find(queryFilters)
      .countDocuments()
      .exec();
    if (totalUsersWithFilter === 0) {
      return 0;
    }
    const totalPages =
      totalUsersWithFilter > pageSize
        ? Math.ceil(totalUsersWithFilter / pageSize)
        : 1;
    return totalPages;
  }

  #buildQueryFilters(filter) {
    const queryFilters = {};
    if (filter?.name) {
      queryFilters.name = { $regex: filter.name, $options: "i" };
    }
    if (filter?.email) {
      queryFilters.email = { $regex: filter.email, $options: "i" };
    }
    if (filter?.birthDate) {
      const birthDateFilter = {};

      if (filter.birthDate.before) {
        birthDateFilter.$lte = new Date(filter.birthDate.before);
      }

      if (filter.birthDate.after) {
        birthDateFilter.$gte = new Date(filter.birthDate.after);
      }

      if (Object.keys(birthDateFilter).length > 0) {
        queryFilters.birthDate = birthDateFilter;
      }
    }
    return queryFilters;
  }
}
