import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <Row>
      <Col>
        <h1 className="text-dark">Página não encontrada</h1>
        <p>Desculpe, a página que você está procurando não existe.</p>
        <Button variant="primary" onClick={handleGoBack}>
          Voltar para a página inicial
        </Button>
      </Col>
    </Row>
  );
};

export default NotFoundPage;
