import { useState, useEffect } from "react";
import { Button, ListGroup } from "react-bootstrap";

const UsersList = ({ getUsers, usersPerPage }) => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers({ page, pageSize: usersPerPage })
      .then((response) => {
        setUsers(response.data);
        setTotalPages(response.totalPages);
      })
      .catch((e) => console.error(e));
  }, [page, getUsers, usersPerPage]);

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => prevPage - 1);
  };

  return (
    <>
      <h2>Usuários</h2>
      <ListGroup>
        {users?.map((user) => (
          <ListGroup.Item
            role="listitem"
            key={user.email}
            aria-label={user.email}
          >
            {user.email} | {user.name} - {user.birthDate}
          </ListGroup.Item>
        ))}
      </ListGroup>
      <Button
        name="página anterior"
        disabled={page <= 1}
        onClick={handlePreviousPage}
      >
        Anterior
      </Button>
      <p>Página {page}</p>
      <Button
        name="próxima página"
        disabled={page === totalPages}
        onClick={handleNextPage}
      >
        Próxima
      </Button>
    </>
  );
};

export default UsersList;
