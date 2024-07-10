import { useState, useEffect } from "react";

const UsersList = ({ getUsers, usersPerPage }) => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    getUsers({ $skip: 0, $take: usersPerPage })
      .then((response) => {
        setUsers(response.data);
      })
      .catch((e) => console.error(e));
  }, [getUsers, usersPerPage]);
  return (
    <>
      <h2>Usuários</h2>
      <ul>
        {users?.map((user) => (
          <li key={user.email}>
            {user.email} | {user.name} - {user.birthDate}
          </li>
        ))}
      </ul>
    </>
  );
};

export default UsersList;
