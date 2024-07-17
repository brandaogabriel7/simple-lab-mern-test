import { render, screen } from "@testing-library/react";
import NotFoundPage from "../NotFoundPage";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

describe("Not found page", () => {
  it("should render a not found message", () => {
    render(<NotFoundPage />);
    expect(
      screen.getByRole("heading", { name: /página não encontrada/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /desculpe, a página que você está procurando não existe/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /voltar para a página inicial/i })
    ).toBeInTheDocument();
  });
});
