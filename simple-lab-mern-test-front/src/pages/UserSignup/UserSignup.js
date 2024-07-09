import { useState } from "react";
import { Button, Form, Toast } from "react-bootstrap";

const UserSignup = ({ createUser }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setEmail(email);
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setName(name);
  };

  const handleBirthDateChange = (e) => {
    const date = e.target.value;
    setBirthDate(date);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUser({ email, name, birthDate });
      console.log("Usuário cadastrado com sucesso");
      setEmail("");
      setName("");
      setBirthDate("");

      // set success message temporarily
      setMessage("Usuário cadastrado com sucesso");
      setShowMessage(true);
    } catch (error) {
      console.error(error);
      setMessage("Não foi possível cadastrar o usuário");
      setShowMessage(true);
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <h2>Cadastrar novo usuário</h2>
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control
            required
            type="email"
            aria-label="Email"
            name="email"
            value={email}
            onChange={handleEmailChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Nome</Form.Label>
          <Form.Control
            required
            type="text"
            aria-label="Nome"
            name="name"
            value={name}
            onChange={handleNameChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Data de nascimento</Form.Label>
          <Form.Control
            type="date"
            required
            onChange={handleBirthDateChange}
            value={birthDate}
            aria-label="Data de nascimento"
          ></Form.Control>
        </Form.Group>
        <Button type="submit">Cadastrar</Button>
      </Form>
      {showMessage && message && (
        <Toast
          onClose={() => {
            setShowMessage(false);
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
