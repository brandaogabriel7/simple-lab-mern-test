import { render, screen } from "@testing-library/react";
import Header from "../Header";
import { MemoryRouter } from "react-router-dom";
describe("Header", () => {
  it("should render navigation links for the website", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("link", { name: /página inicial/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /lista de usuários/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /cadastro/i })).toBeInTheDocument();
  });
});
