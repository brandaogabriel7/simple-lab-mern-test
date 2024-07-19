import { ListGroup, Button, Stack, Container, Col, Row } from "react-bootstrap";

const UsersList = ({ users, handleOpenEditUserDialog }) => {
  return (
    <ListGroup>
      {users?.map((user) => (
        <ListGroup.Item
          role="listitem"
          key={user.email}
          aria-label={user.email}
        >
          <Container>
            <Row>
              <Col sm={10}>
                <Stack>
                  <p>Nome: {user.name}</p>
                  <p>Email: {user.email}</p>
                  <p>Data de Nascimento: {user.birthDate}</p>
                </Stack>
              </Col>
              <Col>
                <Button
                  name="editar"
                  onClick={() => handleOpenEditUserDialog(user)}
                >
                  Editar
                </Button>
              </Col>
            </Row>
          </Container>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default UsersList;
