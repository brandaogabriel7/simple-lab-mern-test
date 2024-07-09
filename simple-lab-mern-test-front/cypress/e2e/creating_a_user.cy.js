describe("Creating a user", () => {
  it("Displays the form to create a user", () => {
    const user = {
      email: "test@test.com",
      name: "Allastor",
      birthDate: "2001-07-03",
    };

    // intercept the request to the API
    cy.intercept("POST", `${Cypress.config().apiUrl}/api/users`, {
      statusCode: 201,
    }).as("signupRequest");

    cy.visit("/signup");

    cy.contains(/cadastrar novo usuário/i)
      .parent("form")
      .as("signupForm");

    cy.get("@signupForm")
      .findByLabelText(/email/i)
      .as("emailInput")
      .type("test@test.com");
    cy.get("@signupForm")
      .findByLabelText(/nome/i)
      .as("nameInput")
      .type("Allastor");
    cy.get("@signupForm")
      .findByLabelText(/data de nascimento/i)
      .as("birthDateInput")
      .type("2001-07-03");

    cy.get("@signupForm").submit();

    // check that the request was made with the correct data
    cy.wait("@signupRequest").then((interception) => {
      expect(interception.request.body).to.deep.equal(user);
    });

    // check that form was reset
    cy.get("@emailInput").should("have.value", "");
    cy.get("@nameInput").should("have.value", "");
    cy.get("@birthDateInput").should("have.value", "");

    // check that the success message is displayed
    cy.contains("Usuário cadastrado com sucesso");
  });
});
