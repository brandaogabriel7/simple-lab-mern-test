import { Button, Form, Spinner } from "react-bootstrap";
import { useState } from "react";
import { useToast } from "../../components/ToastManager/ToastManager";

const toastDelay = 3000;
const UserSignup = ({ createUser }) => {
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);

    const user = Object.fromEntries(formData);

    try {
      await createUser(user);

      addToast(
        "Usuário cadastrado",
        "Usuário cadastrado com sucesso",
        "success",
        toastDelay
      );
    } catch (_) {
      addToast(
        "Erro ao cadastrar usuário",
        "Não foi possível cadastrar o usuário",
        "danger",
        toastDelay
      );
    } finally {
      e.target.reset();
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h1 className="text-dark">Cadastrar novo usuário</h1>
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
      <Button className="mt-2" type="submit">
        {loading ? <Spinner animation="border" size="sm" /> : "Cadastrar"}
      </Button>
    </Form>
  );
};

export default UserSignup;
