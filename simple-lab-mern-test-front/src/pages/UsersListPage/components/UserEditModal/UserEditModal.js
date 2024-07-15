import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

const UserEditModal = ({
  show,
  email,
  name,
  birthDate,
  updateUser,
  handleCloseEditForm,
}) => {
  const [formValues, setFormValues] = useState({ name: "", birthDate: "" });

  useEffect(() => {
    setFormValues({ name, birthDate });
  }, [name, birthDate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleEditUserFormSubmit = async (e) => {
    e.preventDefault();
    await updateUser({ email, ...formValues });
  };
  return (
    <Modal show={show} onHide={handleCloseEditForm}>
      <Modal.Header closeButton>
        <Modal.Title>Editar usuário</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h3>{email}</h3>
        <Form onSubmit={handleEditUserFormSubmit}>
          <Form.Group>
            <Form.Label>Nome</Form.Label>
            <Form.Control
              required
              type="text"
              aria-label="Nome"
              name="name"
              value={formValues.name}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Data de nascimento</Form.Label>
            <Form.Control
              type="date"
              required
              name="birthDate"
              aria-label="Data de nascimento"
              value={formValues.birthDate}
              onChange={handleInputChange}
            ></Form.Control>
          </Form.Group>
          <Button type="submit">Salvar</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UserEditModal;
