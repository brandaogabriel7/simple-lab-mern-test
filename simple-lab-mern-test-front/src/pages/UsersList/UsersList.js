import { useState, useEffect } from "react";
import { Button, Form, ListGroup, Modal, Toast } from "react-bootstrap";
import PropTypes from "prop-types";

const UsersList = ({ getUsers, updateUser, usersPerPage }) => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getUsers({ page, pageSize: usersPerPage })
      .then((response) => {
        setUsers(response.data);
        setTotalPages(response.totalPages);
        setPage(response.page);
      })
      .catch((e) => {
        console.error(e);
        setMessage("Não foi possível carregar os usuários");
      });
  }, [page, getUsers, usersPerPage]);

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => prevPage - 1);
  };

  const handleOpenEditUserDialog = (user) => {
    setEditingUser(user);
  };

  const handleCloseEditForm = () => {
    setEditingUser(null);
  };

  const handleEditUserFieldChange = (e) => {
    setEditingUser((prevUser) => ({
      ...prevUser,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSaveEditedUser = async (e) => {
    e.preventDefault();
    const user = { ...editingUser };
    try {
      await updateUser(user);
      setMessage("Usuário editado com sucesso");
      setEditingUser(null);
      setUsers((prevUsers) => {
        const userIndex = prevUsers.findIndex(
          (prevUser) => prevUser.email === user.email
        );
        const newUsers = [...prevUsers];
        newUsers[userIndex] = user;
        return newUsers;
      });
    } catch (error) {
      console.error(error);
      setMessage("Não foi possível editar o usuário");
    }
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
            <p>
              {user.email} | {user.name} - {user.birthDate}
            </p>
            <Button
              name="editar"
              onClick={() => handleOpenEditUserDialog(user)}
            >
              Editar
            </Button>
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
      <Modal show={!!editingUser} onHide={handleCloseEditForm}>
        <Modal.Header closeButton>
          <Modal.Title>Editar usuário</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h3>{editingUser?.email}</h3>
          <Form onSubmit={handleSaveEditedUser}>
            <Form.Group>
              <Form.Label>Nome</Form.Label>
              <Form.Control
                required
                type="text"
                aria-label="Nome"
                name="name"
                value={editingUser?.name}
                onChange={handleEditUserFieldChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Data de nascimento</Form.Label>
              <Form.Control
                type="date"
                required
                name="birthDate"
                aria-label="Data de nascimento"
                value={editingUser?.birthDate}
                onChange={handleEditUserFieldChange}
              ></Form.Control>
            </Form.Group>
            <Button type="submit">Salvar</Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Toast
        onClose={() => {
          setMessage("");
        }}
        delay={4000}
        autohide
        show={!!message}
      >
        <Toast.Header>{message}</Toast.Header>
      </Toast>
    </>
  );
};

UsersList.propTypes = {
  getUsers: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  usersPerPage: PropTypes.number.isRequired,
};

export default UsersList;
