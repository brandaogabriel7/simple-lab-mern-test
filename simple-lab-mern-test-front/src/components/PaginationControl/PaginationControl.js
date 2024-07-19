import { Button, Col, Container, Row } from "react-bootstrap";

const PaginationControl = ({
  page,
  totalPages,
  handlePreviousPage,
  handleNextPage,
}) => {
  return (
    <Container
      fluid
      className="sticky-bottom bg-light border border-secondary rounded p-3"
    >
      <Row>
        <Col>
          <Button
            name="página anterior"
            disabled={page <= 1}
            onClick={handlePreviousPage}
            className="w-100"
          >
            Anterior
          </Button>
        </Col>
        <Col className="text-center">
          <p>Página {page}</p>
        </Col>
        <Col>
          <Button
            name="próxima página"
            disabled={page === totalPages}
            onClick={handleNextPage}
            className="w-100"
          >
            Próxima
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default PaginationControl;
