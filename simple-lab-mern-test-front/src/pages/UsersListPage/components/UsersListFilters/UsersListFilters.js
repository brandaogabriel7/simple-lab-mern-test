import { Button, Col, Form, Row } from "react-bootstrap";

const UsersListFilters = ({ setFilter }) => {
  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newFilter = Object.fromEntries(formData.entries());
        setFilter(newFilter);
      }}
      className="border border-primary rounded p-3"
    >
      <h4>Filtros</h4>
      <Row>
        <Col md={2}>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              name="email"
              type="text"
              aria-label="Email"
              defaultValue=""
            />
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group>
            <Form.Label>Nome</Form.Label>
            <Form.Control
              name="name"
              type="text"
              aria-label="Nome"
              defaultValue=""
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Nasceu depois de</Form.Label>
            <Form.Control
              name="birthDateAfter"
              type="date"
              aria-label="Nasceu depois de"
              defaultValue=""
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Nasceu antes de</Form.Label>
            <Form.Control
              name="birthDateBefore"
              type="date"
              aria-label="Nasceu antes de"
              defaultValue=""
            />
          </Form.Group>
        </Col>
      </Row>
      <Button className="mt-2" type="submit" aria-label="Filtrar">
        Filtrar
      </Button>
    </Form>
  );
};

export default UsersListFilters;
