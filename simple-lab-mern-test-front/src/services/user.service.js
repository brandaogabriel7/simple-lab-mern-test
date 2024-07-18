import config from "../config/config";

const { apiUrl, usersPerPage } = config;

const createUser = async (user) => {
  const response = await fetch(`${apiUrl}/api/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  if (response.status !== 201) {
    throw new Error("Failed to create user");
  }
};

const updateUser = async (user) => {
  const response = await fetch(`${apiUrl}/api/users`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  if (response.status !== 200) {
    throw new Error("Failed to update user");
  }
};

const getUsers = async (options) => {
  const { page, pageSize, filter } = options;
  const response = await fetch(
    `${apiUrl}/api/users?${new URLSearchParams({
      page,
      pageSize,
      ...filter,
    })}`
  );
  if (response.status !== 200) {
    throw new Error("Failed to get users");
  }
  return response.json();
};

export { createUser, getUsers, updateUser, usersPerPage };
