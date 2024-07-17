import { Container, Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const Header = () => {
  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Container className="ms-1">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link>Página inicial</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/users">
              <Nav.Link>Lista de usuários</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/signup">
              <Nav.Link>Cadastro</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
