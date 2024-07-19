describe("Home Page", () => {
  it("should render the home page", () => {
    cy.visit("/");

    cy.findByRole("heading", { name: /SimpleLab MERN Test/i }).should("exist");
    cy.findByRole("link", { name: /listar usuários/i }).should("exist");
    cy.findByRole("link", { name: /cadastrar usuário/i }).should("exist");
  });

  it("should navigate to the signup page", () => {
    cy.visit("/");

    cy.findByRole("link", { name: /cadastrar usuário/i }).click();

    cy.url().should("include", "/signup");
  });

  it("should navigate to the users list page", () => {
    cy.visit("/");

    cy.findByRole("link", { name: /listar usuários/i }).click();

    cy.url().should("include", "/users");
  });
});
