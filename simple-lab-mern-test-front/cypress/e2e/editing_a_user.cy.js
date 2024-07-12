describe("Editing a user", () => {
  beforeEach(function () {
    cy.setupUsersRequest();

    cy.visit("/");
  });

  it("should edit a user", function () {
    const firstUser = this.usersResponses[0].data[0];

    const updatedFields = {
      name: "New Name",
      birthDate: "2000-01-01",
    };

    cy.findByRole("listitem", {
      name: firstUser.email,
    })
      .findByRole("button", {
        name: /editar/i,
      })
      .click();

    cy.findByRole("dialog").within(() => {
      cy.findByText(/editar usuário/i).should("exist");
      cy.findByText(firstUser.email).should("exist");

      cy.findByLabelText(/nome/i).as("nameInput");
      cy.findByLabelText(/data de nascimento/i).as("birthDateInput");

      cy.get("@nameInput").clear();
      cy.get("@nameInput").type(updatedFields.name);

      cy.get("@birthDateInput").clear();
      cy.get("@birthDateInput").type(updatedFields.birthDate);

      cy.findByRole("button", {
        name: /salvar/i,
      }).click();
    });

    cy.findByText("Usuário editado com sucesso");

    cy.findByRole("listitem", {
      name: firstUser.email,
    })
      .should("contain", firstUser.email)
      .and("contain", updatedFields.name)
      .and("contain", updatedFields.birthDate);
  });
});
