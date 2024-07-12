describe("Listing users", () => {
  beforeEach(function () {
    cy.setupUsersRequest();

    cy.visit("/");

    cy.findByRole("button", {
      name: /anterior/i,
    })
      .as("previousPageButton")
      .should("exist");

    cy.findByRole("button", {
      name: /próxima/i,
    })
      .as("nextPageButton")
      .should("exist");
  });

  it("should list one page of users", function () {
    const usersResponse = this.usersResponses[0];
    cy.wait("@usersRequest");

    usersResponse.data.forEach((user) => {
      cy.findByRole("listitem", {
        name: user.email,
      })
        .should("contain", user.email)
        .should("contain", user.name)
        .should("contain", user.birthDate);
    });

    cy.findByText(/página 1/i).should("exist");
  });

  it("should navigate between pages", function () {
    const usersResponse = this.usersResponses[0];
    cy.wait("@usersRequest");

    usersResponse.data.forEach((user) => {
      cy.findByRole("listitem", {
        name: user.email,
      })
        .should("contain", user.email)
        .should("contain", user.name)
        .should("contain", user.birthDate);
    });

    cy.findByText(/página 1/i).should("exist");
    cy.get("@previousPageButton").should("be.disabled");
    cy.get("@nextPageButton").should("not.be.disabled");

    cy.get("@nextPageButton").click();

    cy.wait("@usersRequest");

    const usersResponse2 = this.usersResponses[1];

    usersResponse2.data.forEach((user) => {
      cy.findByRole("listitem", {
        name: user.email,
      })
        .should("contain", user.email)
        .should("contain", user.name)
        .should("contain", user.birthDate);
    });

    cy.findByText(/página 2/i).should("exist");
    cy.get("@previousPageButton").should("not.be.disabled");
    cy.get("@previousPageButton").click();

    cy.wait("@usersRequest");

    usersResponse.data.forEach((user) => {
      cy.findByRole("listitem", {
        name: user.email,
      })
        .should("contain", user.email)
        .should("contain", user.name)
        .should("contain", user.birthDate);
    });
    cy.findByText(/página 1/i).should("exist");
    cy.get("@previousPageButton").should("be.disabled");
  });

  it("should not try requesting more users after last page", function () {
    const totalPages = this.usersResponses.length;
    for (let i = 1; i < totalPages; i++) {
      cy.get("@nextPageButton").click();
      cy.wait("@usersRequest");
      cy.findByText(new RegExp(`página ${i + 1}`, "i")).should("exist");
    }

    cy.get("@nextPageButton").should("be.disabled");
  });
});
