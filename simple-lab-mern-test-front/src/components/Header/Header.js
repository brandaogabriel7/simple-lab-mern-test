import { Container, Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Container className="ms-1">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link active={location.pathname === "/"}>
                Página inicial
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/users">
              <Nav.Link active={location.pathname === "/users"}>
                Lista de usuários
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/signup">
              <Nav.Link active={location.pathname === "/signup"}>
                Cadastro
              </Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
