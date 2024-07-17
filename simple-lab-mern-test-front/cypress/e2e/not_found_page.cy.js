describe("Not found page", () => {
  it("should render a not found message", () => {
    cy.visit("/non-existing-page");

    cy.findByRole("heading", { name: /página não encontrada/i }).should(
      "exist"
    );
  });
});
