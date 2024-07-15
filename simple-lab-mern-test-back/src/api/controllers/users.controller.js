import { Router } from "express";
import User from "../../domain/entity/user.js";
import BirthDate from "../../domain/value-object/birth-date.js";

const getUserByEmail = async (userService, req, res) => {
  const encodedEmail = req.params.email;
  const email = decodeURIComponent(encodedEmail);
  const user = await userService.getUserByEmail(email);
  if (!user) {
    res.status(404).send();
    return;
  }
  res.json({
    data: {
      email: user.email,
      name: user.name,
      birthDate: user.birthDate.value,
    },
  });
};

const getUsers = async (userService, req, res) => {
  let page = parseInt(req.query.page, 10);
  let pageSize = parseInt(req.query.pageSize, 10);

  if (isNaN(page) || page <= 0) {
    page = 1;
  }

  if (isNaN(pageSize) || pageSize <= 0) {
    pageSize = 50;
  }

  const filter = {
    name: req.query.name,
    email: req.query.email,
    birthDateBefore: req.query.birthDateBefore,
    birthDateAfter: req.query.birthDateAfter,
  };

  const serviceResponse = await userService.getUsers(page, pageSize, filter);
  res.json(buildUserResponse(serviceResponse));
};

const createUser = async (userService, req, res) => {
  const user = req.body;
  const userEntity = new User(
    user.email,
    user.name,
    new BirthDate(user.birthDate)
  );
  try {
    await userService.createUser(userEntity);
  } catch (err) {
    if (err.message === "User with this email already exists") {
      res.status(400).send({ message: err.message });
      return;
    }
    throw err;
  }
  res.status(201).send();
};

const deleteUser = async (userService, req, res) => {
  const encodedEmail = req.params.email;
  const email = decodeURIComponent(encodedEmail);
  await userService.deleteUser(email);
  res.send();
};

const updateUser = async (userService, req, res) => {
  const user = req.body;
  const userEntity = new User(
    user.email,
    user.name,
    new BirthDate(user.birthDate)
  );
  try {
    await userService.updateUser(userEntity);
  } catch (error) {
    if (error.message === "User not found") {
      res.status(404).send();
      return;
    }
    throw error;
  }
  res.send();
};

const buildUserResponse = (serviceResponse) => {
  const userResponse = {
    data: serviceResponse.users.map((user) => ({
      email: user.email,
      name: user.name,
      birthDate: user.birthDate.value,
    })),
    page: serviceResponse.pageInfo.page,
    pageSize: serviceResponse.pageInfo.pageSize,
    totalPages: serviceResponse.pageInfo.totalPages,
    filter: serviceResponse.filter,
  };
  if (
    !serviceResponse.filter.birthDate.before &&
    !serviceResponse.filter.birthDate.after
  ) {
    delete userResponse.filter.birthDate;
  }
  return userResponse;
};
export { getUserByEmail, getUsers, createUser, deleteUser, updateUser };
