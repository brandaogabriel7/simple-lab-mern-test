import { Button } from "react-bootstrap";

const PaginationControl = ({
  page,
  totalPages,
  handlePreviousPage,
  handleNextPage,
}) => {
  return (
    <>
      <Button
        name="página anterior"
        disabled={page <= 1}
        onClick={handlePreviousPage}
      >
        Anterior
      </Button>
      <p>Página {page}</p>
      <Button
        name="próxima página"
        disabled={page === totalPages}
        onClick={handleNextPage}
      >
        Próxima
      </Button>
    </>
  );
};

export default PaginationControl;
