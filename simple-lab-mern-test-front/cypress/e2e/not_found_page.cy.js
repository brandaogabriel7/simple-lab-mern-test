describe("Not found page", () => {
  it("should render a not found message", () => {
    cy.visit("/non-existing-page");

    cy.findByRole("heading", { name: /página não encontrada/i }).should(
      "exist"
    );
    cy.findByText(
      /desculpe, a página que você está procurando não existe/i
    ).should("exist");
    cy.findByRole("button", { name: /voltar para a página inicial/i })
      .should("exist")
      .as("goBackButton");

    cy.get("@goBackButton").click();
    cy.url().should("eq", Cypress.config().baseUrl + "/");
  });
});
