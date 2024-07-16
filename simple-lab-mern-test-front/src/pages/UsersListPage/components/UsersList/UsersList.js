import { ListGroup, Button } from "react-bootstrap";

const UsersList = ({ users, handleOpenEditUserDialog }) => {
  return (
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
          <Button name="editar" onClick={() => handleOpenEditUserDialog(user)}>
            Editar
          </Button>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default UsersList;
