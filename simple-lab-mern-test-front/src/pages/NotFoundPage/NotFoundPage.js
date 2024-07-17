import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <Container className="text-center mt-5">
      <Row>
        <Col>
          <h1 className="mt-4">Página não encontrada</h1>
          <p>Desculpe, a página que você está procurando não existe.</p>
          <Button variant="primary" onClick={handleGoBack}>
            Voltar para a página inicial
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFoundPage;
