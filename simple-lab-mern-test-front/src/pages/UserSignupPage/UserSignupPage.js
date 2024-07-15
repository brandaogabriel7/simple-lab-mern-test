import { Button, Form } from "react-bootstrap";
import { useToast } from "../../components/ToastManager/ToastManager";

const toastDelay = 3000;
const UserSignup = ({ createUser }) => {
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    } catch (error) {
      addToast(
        "Erro ao cadastrar usuário",
        "Não foi possível cadastrar o usuário",
        "error",
        toastDelay
      );
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
    </>
  );
};

export default UserSignup;
