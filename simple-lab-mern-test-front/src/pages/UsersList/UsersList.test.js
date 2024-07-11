import { render, screen } from "@testing-library/react";
import UsersList from "./UsersList";
import { faker } from "@faker-js/faker";
import userEvent from "@testing-library/user-event";
import { toISODateOnlyString } from "../../utils/date-utils";

describe("UsersList", () => {
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

  it("should list one page of users", async () => {
    const usersResponse = usersResponses[0];

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
    expect(await screen.findByText(/página 1/i)).toBeInTheDocument();
  });

  it("should navigate between pages", async () => {
    const user = userEvent.setup();

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

  it("should disable next button when there are no more pages", async () => {
    const user = userEvent.setup();

    render(<UsersList getUsers={getUsers} usersPerPage={usersPerPage} />);

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
});
