import { useState, useEffect } from "react";
import { ListGroup } from "react-bootstrap";

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
      <ListGroup>
        {users?.map((user) => (
          <ListGroup.Item key={user.email}>
            {user.email} | {user.name} - {user.birthDate}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </>
  );
};

export default UsersList;
