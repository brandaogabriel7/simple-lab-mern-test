describe("Navigating with header", function () {
  beforeEach(function () {
    cy.setupUsersRequest();
  });

  it("should navigate to home page", function () {
    cy.visit("/users");
    cy.findByRole("link", {
      name: /página inicial/i,
    }).click();

    cy.url().should("eq", Cypress.config().baseUrl + "/");
  });

  it("should navigate to the users page", function () {
    cy.visit("/");
    cy.findByRole("link", {
      name: /lista de usuários/i,
    }).click();

    // match url by regex
    cy.url().should(
      "match",
      new RegExp(`^${Cypress.config().baseUrl}/users.*`, "i")
    );
  });

  it("should navigate to the signup page", function () {
    cy.visit("/");
    cy.findByRole("link", {
      name: /cadastro/i,
    }).click();

    cy.url().should("eq", Cypress.config().baseUrl + "/signup");
  });
});
