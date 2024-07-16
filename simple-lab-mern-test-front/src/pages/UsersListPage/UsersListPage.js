import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import PropTypes from "prop-types";
import { useToast } from "../../components/ToastManager/ToastManager";
import UserEditModal from "./components/UserEditModal/UserEditModal";
import UsersList from "./components/UsersList/UsersList";

const UsersListPage = ({ getUsers, updateUser, usersPerPage }) => {
  const { addToast } = useToast();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers({ page, pageSize: usersPerPage })
      .then((response) => {
        setUsers(response.data);
        setTotalPages(response.totalPages);
      })
      .catch((_) => {
        addToast(
          "Erro ao buscar usuários",
          "Não foi possível buscar os usuários",
          "danger",
          3000
        );
      });
  }, [page, getUsers, usersPerPage, addToast]);

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

  const handleUpdateUser = async (user) => {
    try {
      await updateUser(user);
      addToast(
        "Usuário editado",
        "Usuário editado com sucesso",
        "success",
        3000
      );
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
      addToast(
        "Erro ao editar usuário",
        "Não foi possível editar o usuário",
        "danger",
        3000
      );
    }
  };

  return (
    <>
      <h2>Usuários</h2>
      <UsersList
        users={users}
        handleOpenEditUserDialog={handleOpenEditUserDialog}
      />
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
      {editingUser && (
        <UserEditModal
          show
          email={editingUser?.email}
          name={editingUser?.name}
          birthDate={editingUser?.birthDate}
          updateUser={handleUpdateUser}
          handleCloseEditForm={handleCloseEditForm}
        />
      )}
    </>
  );
};

UsersListPage.propTypes = {
  getUsers: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  usersPerPage: PropTypes.number.isRequired,
};

export default UsersListPage;
