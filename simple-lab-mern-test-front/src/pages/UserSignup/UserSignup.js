import { useState } from "react";
import { Button, Form, Toast } from "react-bootstrap";

const UserSignup = ({ createUser }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const user = Object.fromEntries(formData);

    try {
      await createUser(user);
      console.log("Usuário cadastrado com sucesso");

      setMessage("Usuário cadastrado com sucesso");
    } catch (error) {
      console.error(error);
      setMessage("Não foi possível cadastrar o usuário");
    } finally {
      e.target.reset();
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <h2>Cadastrar novo usuário</h2>
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control required type="email" aria-label="Email" name="email" />
        </Form.Group>
        <Form.Group>
          <Form.Label>Nome</Form.Label>
          <Form.Control required type="text" aria-label="Nome" name="name" />
        </Form.Group>
        <Form.Group>
          <Form.Label>Data de nascimento</Form.Label>
          <Form.Control
            type="date"
            required
            name="birthDate"
            aria-label="Data de nascimento"
          ></Form.Control>
        </Form.Group>
        <Button type="submit">Cadastrar</Button>
      </Form>
      {message && (
        <Toast
          onClose={() => {
            setMessage("");
          }}
          delay={4000}
          autohide
        >
          <Toast.Header>{message}</Toast.Header>
        </Toast>
      )}
    </>
  );
};

export default UserSignup;
