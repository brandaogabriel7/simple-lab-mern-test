import { render, screen } from "@testing-library/react";
import { default as UserSignup } from "./UserSignup";
import { faker } from "@faker-js/faker";
import userEvent from "@testing-library/user-event";
import { toISODateOnlyString } from "../../utils/date-utils";

describe("User sign up page tests", () => {
  it("should display signup form", () => {
    render(<UserSignup />);
    expect(
      screen.getByRole("heading", { name: /Cadastrar novo usuário/i })
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/data de nascimento/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /cadastrar/i })
    ).toBeInTheDocument();
  });

  it("should submit the form", async () => {
    const user = userEvent.setup();

    const createUser = jest.fn();
    render(<UserSignup createUser={createUser} />);

    const email = faker.internet.email();
    const name = faker.person.fullName();
    const birthDate = toISODateOnlyString(faker.date.past());

    const emailInput = screen.getByLabelText(/email/i);
    const nameInput = screen.getByLabelText(/nome/i);
    const birthDateInput = screen.getByLabelText(/data de nascimento/i);
    const submitButton = screen.getByRole("button", { name: /cadastrar/i });

    await user.type(emailInput, email);
    await user.type(nameInput, name);
    await user.type(birthDateInput, birthDate);
    await user.click(submitButton);

    expect(createUser).toHaveBeenCalledWith({ email, name, birthDate });

    expect(emailInput).toHaveValue("");
    expect(nameInput).toHaveValue("");
    expect(birthDateInput).toHaveValue("");

    expect(
      await screen.findByText(/usuário cadastrado com sucesso/i)
    ).toBeInTheDocument();
  });

  it("should show error message when user creation fails", async () => {
    const user = userEvent.setup();
    const createUser = jest.fn();
    createUser.mockRejectedValueOnce(new Error("Couldn't create user"));
    render(<UserSignup createUser={createUser} />);

    const submitButton = screen.getByRole("button", { name: /cadastrar/i });

    await user.click(submitButton);

    expect(
      screen.getByText(/não foi possível cadastrar o usuário/i)
    ).toBeInTheDocument();
  });
});
