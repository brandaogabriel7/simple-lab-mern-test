import { render, screen } from "@testing-library/react";
import UsersListPage from "../UsersListPage";
import userEvent from "@testing-library/user-event";
import { faker } from "@faker-js/faker";
import { toISODateOnlyString } from "../../../utils/date-utils";

jest.mock("../../../components/ToastManager/ToastManager");

const pageSize = 5;

const getUsersMock = (expectedResponse, responseBeforeFilter) => {
  const getUsers = jest.fn();
  getUsers.mockImplementation(({ filter }) => {
    if (Object.keys(filter).length !== 0) {
      return Promise.resolve(expectedResponse);
    }
    return Promise.resolve(responseBeforeFilter);
  });
  return getUsers;
};

const generateUsersWithoutFilter = (quantity) => {
  return {
    data: Array.from({ length: quantity }, () => ({
      email: faker.internet.email(),
      name: faker.person.fullName(),
      birthDate: toISODateOnlyString(faker.date.past()),
    })),
    page: 1,
    pageSize: quantity,
    totalPages: 1,
    filter: {},
  };
};
describe("UsersList filtering tests", () => {
  it("should filter by email", async () => {
    const user = userEvent.setup();

    const emailFilter = "test-email";
    const responseBeforeFilter = generateUsersWithoutFilter(pageSize);
    const expectedResponse = {
      data: Array.from({ length: pageSize }, (_, i) => ({
        email: `${emailFilter}-${i}@test.com`,
        name: faker.person.fullName(),
        birthDate: toISODateOnlyString(faker.date.past()),
      })),
      page: 1,
      pageSize: pageSize,
      totalPages: 1,
      filter: {
        email: emailFilter,
      },
    };
    const getUsers = getUsersMock(expectedResponse, responseBeforeFilter);

    render(
      <UsersListPage
        getUsers={getUsers}
        updateUser={() => {}}
        usersPerPage={pageSize}
      />
    );

    expect(getUsers).toHaveBeenCalledWith({
      page: 1,
      pageSize: pageSize,
      filter: {},
    });
    for (let user of responseBeforeFilter.data) {
      const userItem = await screen.findByRole("listitem", {
        name: user.email,
      });
      expect(userItem).toBeInTheDocument();
      expect(userItem).toContainHTML(user.email);
      expect(userItem).toContainHTML(user.name);
      expect(userItem).toContainHTML(user.birthDate);
    }

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, expectedResponse.filter.email);

    const filterButton = screen.getByRole("button", { name: /filtrar/i });
    await user.click(filterButton);

    expect(getUsers).toHaveBeenCalledWith({
      page: 1,
      pageSize: pageSize,
      filter: expect.objectContaining({
        email: emailFilter,
      }),
    });
    for (let user of expectedResponse.data) {
      const userItem = await screen.findByRole("listitem", {
        name: user.email,
      });
      expect(userItem).toBeInTheDocument();
      expect(userItem).toContainHTML(user.email);
      expect(userItem).toContainHTML(user.name);
      expect(userItem).toContainHTML(user.birthDate);
    }
  });

  it("should filter by name", async () => {
    const user = userEvent.setup();

    const nameFilter = "test-name";
    const responseBeforeFilter = generateUsersWithoutFilter(pageSize);
    const expectedResponse = {
      data: Array.from({ length: pageSize }, (_, i) => ({
        email: faker.internet.email(),
        name: `${nameFilter}-${i}`,
        birthDate: toISODateOnlyString(faker.date.past()),
      })),
      page: 1,
      pageSize: pageSize,
      totalPages: 1,
      filter: {
        name: nameFilter,
      },
    };
    const getUsers = getUsersMock(expectedResponse, responseBeforeFilter);

    render(
      <UsersListPage
        getUsers={getUsers}
        updateUser={() => {}}
        usersPerPage={pageSize}
      />
    );

    expect(getUsers).toHaveBeenCalledWith({
      page: 1,
      pageSize: pageSize,
      filter: {},
    });
    for (let user of responseBeforeFilter.data) {
      const userItem = await screen.findByRole("listitem", {
        name: user.email,
      });
      expect(userItem).toBeInTheDocument();
      expect(userItem).toContainHTML(user.email);
      expect(userItem).toContainHTML(user.name);
      expect(userItem).toContainHTML(user.birthDate);
    }

    const nameInput = screen.getByLabelText(/nome/i);
    await user.type(nameInput, expectedResponse.filter.name);
    const filterButton = screen.getByRole("button", { name: /filtrar/i });
    await user.click(filterButton);

    expect(getUsers).toHaveBeenCalledWith({
      page: 1,
      pageSize: pageSize,
      filter: expect.objectContaining({
        name: nameFilter,
      }),
    });
    for (let user of expectedResponse.data) {
      const userItem = await screen.findByRole("listitem", {
        name: user.email,
      });
      expect(userItem).toBeInTheDocument();
      expect(userItem).toContainHTML(user.email);
      expect(userItem).toContainHTML(user.name);
      expect(userItem).toContainHTML(user.birthDate);
    }
  });

  it("should filter by birth date", async () => {
    const user = userEvent.setup();

    const birthDateAfterFilter = "1990-01-01";
    const birthDateBeforeFilter = "2000-01-01";
    const responseBeforeFilter = generateUsersWithoutFilter(pageSize);
    const expectedResponse = {
      data: Array.from({ length: pageSize }, (_, i) => ({
        email: faker.internet.email(),
        name: faker.person.fullName(),
        birthDate: toISODateOnlyString(
          faker.date.between({
            from: new Date(birthDateAfterFilter),
            to: new Date(birthDateBeforeFilter),
          })
        ),
      })),
      page: 1,
      pageSize: pageSize,
      totalPages: 1,
      filter: {
        birthDateAfter: birthDateAfterFilter,
        birthDateBefore: birthDateBeforeFilter,
      },
    };
    const getUsers = getUsersMock(expectedResponse, responseBeforeFilter);

    render(
      <UsersListPage
        getUsers={getUsers}
        updateUser={() => {}}
        usersPerPage={pageSize}
      />
    );

    expect(getUsers).toHaveBeenCalledWith({
      page: 1,
      pageSize: pageSize,
      filter: {},
    });
    for (let user of responseBeforeFilter.data) {
      const userItem = await screen.findByRole("listitem", {
        name: user.email,
      });
      expect(userItem).toBeInTheDocument();
      expect(userItem).toContainHTML(user.email);
      expect(userItem).toContainHTML(user.name);
      expect(userItem).toContainHTML(user.birthDate);
    }

    const birthDateAfterInput = screen.getByLabelText(/nasceu depois de/i);
    const birthDateBeforeInput = screen.getByLabelText(/nasceu antes de/i);
    await user.type(
      birthDateAfterInput,
      expectedResponse.filter.birthDateAfter
    );
    await user.type(
      birthDateBeforeInput,
      expectedResponse.filter.birthDateBefore
    );
    const filterButton = screen.getByRole("button", { name: /filtrar/i });
    await user.click(filterButton);

    expect(getUsers).toHaveBeenCalledWith({
      page: 1,
      pageSize: pageSize,
      filter: expect.objectContaining({
        birthDateAfter: birthDateAfterFilter,
        birthDateBefore: birthDateBeforeFilter,
      }),
    });
    for (let user of expectedResponse.data) {
      const userItem = await screen.findByRole("listitem", {
        name: user.email,
      });
      expect(userItem).toBeInTheDocument();
      expect(userItem).toContainHTML(user.email);
      expect(userItem).toContainHTML(user.name);
      expect(userItem).toContainHTML(user.birthDate);
    }
  });

  it("should filter by all fields", async () => {
    const user = userEvent.setup();

    const nameFilter = "test-name";
    const emailFilter = "test-email";
    const birthDateAfterFilter = "1990-01-01";
    const birthDateBeforeFilter = "2000-01-01";
    const responseBeforeFilter = generateUsersWithoutFilter(pageSize);
    const expectedResponse = {
      data: Array.from({ length: pageSize }, (_, i) => ({
        email: `${emailFilter}-${i}@test.com`,
        name: `${nameFilter}-${i}`,
        birthDate: toISODateOnlyString(
          faker.date.between({
            from: new Date(birthDateAfterFilter),
            to: new Date(birthDateBeforeFilter),
          })
        ),
      })),
      page: 1,
      pageSize: pageSize,
      totalPages: 1,
      filter: {
        name: nameFilter,
        email: emailFilter,
        birthDateAfter: birthDateAfterFilter,
        birthDateBefore: birthDateBeforeFilter,
      },
    };
    const getUsers = getUsersMock(expectedResponse, responseBeforeFilter);

    render(
      <UsersListPage
        getUsers={getUsers}
        updateUser={() => {}}
        usersPerPage={pageSize}
      />
    );

    expect(getUsers).toHaveBeenCalledWith({
      page: 1,
      pageSize: pageSize,
      filter: {},
    });
    for (let user of responseBeforeFilter.data) {
      const userItem = await screen.findByRole("listitem", {
        name: user.email,
      });
      expect(userItem).toBeInTheDocument();
      expect(userItem).toContainHTML(user.email);
      expect(userItem).toContainHTML(user.name);
      expect(userItem).toContainHTML(user.birthDate);
    }

    const nameInput = screen.getByLabelText(/nome/i);
    await user.type(nameInput, expectedResponse.filter.name);
    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, expectedResponse.filter.email);
    const birthDateAfterInput = screen.getByLabelText(/nasceu depois de/i);
    await user.type(
      birthDateAfterInput,
      expectedResponse.filter.birthDateAfter
    );
    const birthDateBeforeInput = screen.getByLabelText(/nasceu antes de/i);
    await user.type(
      birthDateBeforeInput,
      expectedResponse.filter.birthDateBefore
    );
    const filterButton = screen.getByRole("button", { name: /filtrar/i });
    await user.click(filterButton);

    expect(getUsers).toHaveBeenCalledWith({
      page: 1,
      pageSize: pageSize,
      filter: expect.objectContaining({
        name: nameFilter,
        email: emailFilter,
        birthDateAfter: birthDateAfterFilter,
        birthDateBefore: birthDateBeforeFilter,
      }),
    });
    for (let user of expectedResponse.data) {
      const userItem = await screen.findByRole("listitem", {
        name: user.email,
      });
      expect(userItem).toBeInTheDocument();
      expect(userItem).toContainHTML(user.email);
      expect(userItem).toContainHTML(user.name);
      expect(userItem).toContainHTML(user.birthDate);
    }
  });
});
