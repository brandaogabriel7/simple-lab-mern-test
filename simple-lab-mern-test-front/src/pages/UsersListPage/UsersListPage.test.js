import { render, screen, within } from "@testing-library/react";
import UsersListPage from "./UsersListPage";
import { faker } from "@faker-js/faker";
import userEvent from "@testing-library/user-event";
import { toISODateOnlyString } from "../../utils/date-utils";

describe("UsersList", () => {
  const usersPerPage = 5;
  const totalPages = 4;
  let usersResponses;
  let getUsers;
  let updateUser;

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

    updateUser = jest.fn();
  });

  it("should list one page of users", async () => {
    const usersResponse = usersResponses[0];

    render(
      <UsersListPage
        getUsers={getUsers}
        updateUser={updateUser}
        usersPerPage={usersPerPage}
      />
    );

    expect(getUsers).toHaveBeenCalledWith({ page: 1, pageSize: usersPerPage });

    for (let user of usersResponse.data) {
      const userItem = await screen.findByRole("listitem", {
        name: user.email,
      });
      expect(userItem).toBeInTheDocument();
      expect(userItem).toContainHTML(user.email);
      expect(userItem).toContainHTML(user.name);
      expect(userItem).toContainHTML(user.birthDate);
    }
    expect(await screen.findByText(/página 1/i)).toBeInTheDocument();
  });

  it("should navigate between pages", async () => {
    const user = userEvent.setup();

    render(
      <UsersListPage
        getUsers={getUsers}
        updateUser={updateUser}
        usersPerPage={usersPerPage}
      />
    );

    // test first page
    const previousButton = screen.getByRole("button", { name: /anterior/i });
    const nextButton = screen.getByRole("button", { name: /próxima/i });

    expect(getUsers).toHaveBeenCalledWith({ page: 1, pageSize: usersPerPage });

    for (let user of usersResponses[0].data) {
      const userItem = await screen.findByRole("listitem", {
        name: user.email,
      });
      expect(userItem).toBeInTheDocument();
      expect(userItem).toContainHTML(user.email);
      expect(userItem).toContainHTML(user.name);
      expect(userItem).toContainHTML(user.birthDate);
    }
    expect(await screen.findByText(/página 1/i)).toBeInTheDocument();
    expect(previousButton).toBeDisabled();

    // test second page
    await user.click(nextButton);

    expect(getUsers).toHaveBeenCalledWith({ page: 2, pageSize: usersPerPage });

    for (let user of usersResponses[1].data) {
      const userItem = await screen.findByRole("listitem", {
        name: user.email,
      });
      expect(userItem).toBeInTheDocument();
      expect(userItem).toContainHTML(user.email);
      expect(userItem).toContainHTML(user.name);
      expect(userItem).toContainHTML(user.birthDate);
    }
    expect(await screen.findByText(/página 2/i)).toBeInTheDocument();
    expect(previousButton).not.toBeDisabled();

    // test going back to first page
    await user.click(previousButton);

    expect(getUsers).toHaveBeenCalledWith({ page: 1, pageSize: usersPerPage });

    for (let user of usersResponses[0].data) {
      const userItem = await screen.findByRole("listitem", {
        name: user.email,
      });
      expect(userItem).toBeInTheDocument();
      expect(userItem).toContainHTML(user.email);
      expect(userItem).toContainHTML(user.name);
      expect(userItem).toContainHTML(user.birthDate);
    }
    expect(await screen.findByText(/página 1/i)).toBeInTheDocument();
    expect(previousButton).toBeDisabled();
  });

  it("should disable next button when there are no more pages", async () => {
    const user = userEvent.setup();

    render(
      <UsersListPage
        getUsers={getUsers}
        updateUser={updateUser}
        usersPerPage={usersPerPage}
      />
    );

    const nextButton = screen.getByRole("button", { name: /próxima/i });

    for (let i = 1; i < 4; i++) {
      await user.click(nextButton);
      expect(getUsers).toHaveBeenCalledWith({
        page: i + 1,
        pageSize: usersPerPage,
      });
      expect(
        await screen.findByText(new RegExp(`página ${i + 1}`, "i"))
      ).toBeInTheDocument();
    }

    expect(nextButton).toBeDisabled();
  });

  it("should edit a user", async () => {
    const user = userEvent.setup();

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

    expect(
      await screen.findByText(/usuário editado com sucesso/i)
    ).toBeInTheDocument();

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

    expect(
      await screen.findByText(/usuário editado com sucesso/i)
    ).toBeInTheDocument();

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
