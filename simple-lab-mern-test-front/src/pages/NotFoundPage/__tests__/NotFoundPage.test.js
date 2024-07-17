import { render, screen } from "@testing-library/react";
import NotFoundPage from "../NotFoundPage";

describe("Not found page", () => {
  it("should render a not found message", () => {
    render(<NotFoundPage />);
    expect(
      screen.getByRole("heading", { name: /página não encontrada/i })
    ).toBeInTheDocument();
  });
});
