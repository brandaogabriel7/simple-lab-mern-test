import { render, screen } from "@testing-library/react";
import PaginationControl from "./PaginationControl";

describe("PaginationControl", () => {
  it("should render", () => {
    render(
      <PaginationControl
        page={1}
        totalPages={1}
        handlePreviousPage={() => {}}
        handleNextPage={() => {}}
      />
    );

    expect(screen.getByText(/página 1/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /anterior/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /próxima/i })
    ).toBeInTheDocument();
  });

  it("should change to next page", () => {
    const handleNextPage = jest.fn();

    render(
      <PaginationControl
        page={1}
        totalPages={2}
        handlePreviousPage={() => {}}
        handleNextPage={handleNextPage}
      />
    );

    const nextPageButton = screen.getByRole("button", { name: /próxima/i });

    nextPageButton.click();

    expect(handleNextPage).toHaveBeenCalled();
  });

  it("should change to previous page", () => {
    const handlePreviousPage = jest.fn();

    render(
      <PaginationControl
        page={2}
        totalPages={2}
        handlePreviousPage={handlePreviousPage}
        handleNextPage={() => {}}
      />
    );

    const previousPageButton = screen.getByRole("button", {
      name: /anterior/i,
    });

    previousPageButton.click();

    expect(handlePreviousPage).toHaveBeenCalled();
  });
});
