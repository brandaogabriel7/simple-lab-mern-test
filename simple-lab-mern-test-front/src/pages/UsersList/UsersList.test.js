import { render, screen } from "@testing-library/react";
import UsersList from "./UsersList";
import { faker } from "@faker-js/faker";
import userEvent from "@testing-library/user-event";

describe("UsersList", () => {
  const usersPerPage = 5;
  let usersResponses;
  beforeEach(() => {
    usersResponses = Array.from({ length: 4 }, () => {
      return {
        data: Array.from({ length: usersPerPage }, () => ({
          email: faker.internet.email(),
          name: faker.person.fullName(),
          birthDate: faker.date.past().toISOString().split("T")[0],
        })),
      };
    });
  });

  it("should list one page of users", async () => {
    const usersResponse = usersResponses[0];

    const getUsers = jest.fn();
    getUsers.mockResolvedValueOnce(usersResponse);

    render(<UsersList getUsers={getUsers} usersPerPage={usersPerPage} />);

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
  });

  it("should navigate between pages", async () => {
    const user = userEvent.setup();

    const getUsers = jest.fn();
    getUsers.mockImplementation((options) => {
      return Promise.resolve(usersResponses[options.page - 1]);
    });

    render(<UsersList getUsers={getUsers} usersPerPage={usersPerPage} />);

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
});
