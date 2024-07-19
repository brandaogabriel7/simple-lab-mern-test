import { Button, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const Home = () => (
  <>
    <Row>
      <h1 className="text-dark">SimpleLab MERN Test</h1>
      <p>
        Esse projeto é parte do processo seletivo para a empresa SimpleLab. Você
        pode encontrar o repositório com todo o código{" "}
        <a
          href="https://github.com/brandaogabriel7/simple-lab-mern-test"
          target="_blank"
          rel="noreferrer"
        >
          aqui
        </a>
        .{" "}
      </p>
    </Row>
    <Row className="mt-3">
      <Col>
        <Link to="/users">
          <Button variant="primary">Listar usuários</Button>
        </Link>
      </Col>
      <Col>
        <Link to="/signup">
          <Button variant="primary">Cadastrar usuário</Button>
        </Link>
      </Col>
    </Row>
  </>
);

export default Home;
