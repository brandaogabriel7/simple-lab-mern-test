import { Col, Container, Form, Row } from "react-bootstrap";

const UsersListFilters = ({ filter, setFilter }) => {
  const handleChangeFilter = (e) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      [e.target.name]: e.target.value,
    }));
  };
  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
      }}
      as={Container}
      className="border border-primary rounded p-3"
    >
      <h4>Filtros</h4>
      <Row>
        <Form.Group as={Col}>
          <Form.Label>Email</Form.Label>
          <Form.Control
            name="email"
            type="text"
            aria-label="Email"
            value={filter.email || ""}
            onChange={handleChangeFilter}
          />
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>Nome</Form.Label>
          <Form.Control
            name="name"
            type="text"
            aria-label="Nome"
            value={filter.name || ""}
            onChange={handleChangeFilter}
          />
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>Nasceu depois de</Form.Label>
          <Form.Control
            name="birthDateAfter"
            type="date"
            aria-label="Nasceu depois de"
            value={filter.birthDateAfter || ""}
            onChange={handleChangeFilter}
          />
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>Nasceu antes de</Form.Label>
          <Form.Control
            name="birthDateBefore"
            type="date"
            aria-label="Nasceu antes de"
            value={filter.birthDateBefore || ""}
            onChange={handleChangeFilter}
          />
        </Form.Group>
      </Row>
    </Form>
  );
};

export default UsersListFilters;
