import { render, screen, within } from "@testing-library/react";
import UsersListPage from "./UsersListPage";
import { faker } from "@faker-js/faker";
import userEvent from "@testing-library/user-event";
import { toISODateOnlyString } from "../../utils/date-utils";

const mockAddToast = jest.fn();
jest.mock("../../components/ToastManager/ToastManager", () => ({
  useToast: () => ({
    addToast: mockAddToast,
  }),
}));

describe("UsersList editing tests", () => {
  const usersPerPage = 5;
  const totalPages = 4;
  let usersResponses;
  let getUsers;

  beforeEach(() => {
    usersResponses = Array.from({ length: totalPages }, (_, index) => {
      return {
        data: Array.from({ length: usersPerPage }, () => ({
          email: faker.internet.email(),
          name: faker.person.fullName(),
          birthDate: toISODateOnlyString(faker.date.past()),
        })),
        page: index + 1,
        totalPages,
      };
    });
    getUsers = jest.fn();
    getUsers.mockImplementation((options) => {
      return Promise.resolve(
        usersResponses.find((response) => response.page === options.page)
      );
    });
  });

  it("should edit a user", async () => {
    const user = userEvent.setup();

    const updateUser = jest.fn();

    render(
      <UsersListPage
        getUsers={getUsers}
        updateUser={updateUser}
        usersPerPage={usersPerPage}
      />
    );

    const firstUser = usersResponses[0].data[0];
    const updatedFields = {
      name: "New Name",
      birthDate: "2000-01-01",
    };

    const userItem = await screen.findByRole("listitem", {
      name: firstUser.email,
    });
    const editButton = within(userItem).getByRole("button", {
      name: /editar/i,
    });
    await user.click(editButton);

    let editDialog = await screen.findByRole("dialog");

    expect(within(editDialog).getByText(/editar usuário/i)).toBeInTheDocument();
    expect(within(editDialog).getByText(firstUser.email)).toBeInTheDocument();

    let nameInput = within(editDialog).getByLabelText(/nome/i);
    let birthDateInput =
      within(editDialog).getByLabelText(/data de nascimento/i);

    await user.clear(nameInput);
    await user.type(nameInput, updatedFields.name);

    await user.clear(birthDateInput);
    await user.type(birthDateInput, updatedFields.birthDate);

    let submitButton = within(editDialog).getByRole("button", {
      name: /salvar/i,
    });
    await user.click(submitButton);

    expect(updateUser).toHaveBeenCalledWith({
      email: firstUser.email,
      ...updatedFields,
    });

    expect(mockAddToast).toHaveBeenCalledWith(
      expect.stringMatching(/usuário editado/i),
      expect.stringMatching(/usuário editado com sucesso/i),
      "success",
      expect.any(Number)
    );

    const updatedUserItem = await screen.findByRole("listitem", {
      name: firstUser.email,
    });
    expect(updatedUserItem).toContainHTML(firstUser.email);
    expect(updatedUserItem).toContainHTML(updatedFields.name);
    expect(updatedUserItem).toContainHTML(updatedFields.birthDate);

    const secondUser = usersResponses[0].data[1];
    const updatedFieldsSecondUser = {
      name: "New Name 2",
      birthDate: "2000-01-02",
    };

    const secondUserItem = await screen.findByRole("listitem", {
      name: secondUser.email,
    });

    const editButtonSecondUser = within(secondUserItem).getByRole("button", {
      name: /editar/i,
    });

    await user.click(editButtonSecondUser);

    editDialog = await screen.findByRole("dialog");
    nameInput = within(editDialog).getByLabelText(/nome/i);
    birthDateInput = within(editDialog).getByLabelText(/data de nascimento/i);

    await user.clear(nameInput);
    await user.type(nameInput, updatedFieldsSecondUser.name);

    await user.clear(birthDateInput);
    await user.type(birthDateInput, updatedFieldsSecondUser.birthDate);

    submitButton = within(editDialog).getByRole("button", {
      name: /salvar/i,
    });

    await user.click(submitButton);

    expect(mockAddToast).toHaveBeenCalledWith(
      expect.stringMatching(/usuário editado/i),
      expect.stringMatching(/usuário editado com sucesso/i),
      "success",
      expect.any(Number)
    );

    const updatedSecondUserItem = await screen.findByRole("listitem", {
      name: secondUser.email,
    });

    expect(updatedSecondUserItem).toContainHTML(secondUser.email);
    expect(updatedSecondUserItem).toContainHTML(updatedFieldsSecondUser.name);
    expect(updatedSecondUserItem).toContainHTML(
      updatedFieldsSecondUser.birthDate
    );
  });
});
