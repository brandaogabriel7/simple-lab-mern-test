describe("Listing users", () => {
  it("should list one page of users", () => {
    cy.fixture("users/onePage.json").then((usersResponse) => {
      cy.intercept(
        {
          method: "GET",
          pathname: "/api/users",
          query: {
            $skip: "0",
          },
        },
        {
          fixture: "users/onePage.json",
        }
      ).as("usersRequest");

      cy.visit("/");

      cy.wait("@usersRequest");

      usersResponse.data.forEach((user) => {
        cy.contains(user.email)
          .closest("li")
          .should("contain", user.name)
          .should("contain", user.birthDate);
      });
    });
  });
});
