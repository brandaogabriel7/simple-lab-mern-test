import { render, screen, within } from "@testing-library/react";
import UsersList from "./UsersList";
import { faker } from "@faker-js/faker";

describe("UsersList", () => {
  it("should list one page of users", async () => {
    const usersPerPage = 5;
    const usersResponse = {
      data: Array.from(() => ({
        faker: faker.internet.email(),
        name: faker.person.fullName(),
        birthDate: faker.date.past().toISOString().split("T")[0],
      })),
    };

    const getUsers = jest.fn();
    getUsers.mockResolvedValueOnce(usersResponse);

    render(<UsersList getUsers={getUsers} usersPerPage={usersPerPage} />);

    expect(getUsers).toHaveBeenCalledWith({ $skip: 0, $take: usersPerPage });

    for (let user of usersResponse.data) {
      const userItem = await screen.findByRole("listitem", {
        name: user.email,
      });
      expect(userItem).toBeInTheDocument();
      expect(within(userItem).getByText(user.name)).toBeInTheDocument();
      expect(within(userItem).getByText(user.birthDate)).toBeInTheDocument();
    }
  });
});
