import usersFilteredByName from "../fixtures/users/usersFilteredByName.json";
import usersFilteredByEmail from "../fixtures/users/usersFilteredByEmail.json";
import usersFilteredByBirthDate from "../fixtures/users/usersFilteredByBirthDate.json";
import usersFilteredByAllFields from "../fixtures/users/usersFilteredByAllFields.json";

describe("Filtering users list", function () {
  beforeEach(function () {
    cy.intercept(
      {
        method: "GET",
        pathname: "/api/users",
      },
      (req) => {
        const responses = {
          name: usersFilteredByName,
          email: usersFilteredByEmail,
          birthDate: usersFilteredByBirthDate,
          allFields: usersFilteredByAllFields,
        };

        const { name, email, birthDateAfter, birthDateBefore } = req.query;
        if (name && email && birthDateAfter && birthDateBefore) {
          return req.reply(responses.allFields);
        }
        if (name) {
          return req.reply(responses.name);
        }
        if (email) {
          return req.reply(responses.email);
        }
        if (birthDateAfter || birthDateBefore) {
          return req.reply(responses.birthDate);
        }
      }
    ).as("filterRequest");

    cy.visit("/");
    cy.findByLabelText(/nome/i).as("nameFilterInput");
    cy.findByLabelText(/email/i).as("emailFilterInput");
    cy.findByLabelText(/nasceu depois de/i).as("birthDateAfterFilterInput");
    cy.findByLabelText(/nasceu antes de/i).as("birthDateBeforeFilterInput");
  });
  it("should filter users by name", function () {
    cy.get("@nameFilterInput").should("have.value", "");
    cy.get("@emailFilterInput").should("have.value", "");
    cy.get("@birthDateAfterFilterInput").should("have.value", "");
    cy.get("@birthDateBeforeFilterInput").should("have.value", "");

    cy.get("@nameFilterInput").type(usersFilteredByName.filter.name);

    cy.wait("@filterRequest");

    for (let user of usersFilteredByName.data) {
      cy.findByRole("listitem", {
        name: user.email,
      })
        .should("contain", user.email)
        .and("contain", user.name)
        .and("contain", user.birthDate);

      expect(user.name).to.include(usersFilteredByName.filter.name);
    }
  });

  it("should filter users by email", function () {
    cy.get("@nameFilterInput").should("have.value", "");
    cy.get("@emailFilterInput").should("have.value", "");
    cy.get("@birthDateAfterFilterInput").should("have.value", "");
    cy.get("@birthDateBeforeFilterInput").should("have.value", "");

    cy.get("@emailFilterInput").type(usersFilteredByEmail.filter.email);

    cy.wait("@filterRequest");

    for (let user of usersFilteredByEmail.data) {
      cy.findByRole("listitem", {
        name: user.email,
      })
        .should("contain", user.email)
        .and("contain", user.name)
        .and("contain", user.birthDate);
      expect(user.email).to.include(usersFilteredByEmail.filter.email);
    }
  });

  it("should filter users by birth date", function () {
    cy.get("@nameFilterInput").should("have.value", "");
    cy.get("@emailFilterInput").should("have.value", "");
    cy.get("@birthDateAfterFilterInput").should("have.value", "");
    cy.get("@birthDateBeforeFilterInput").should("have.value", "");

    cy.get("@birthDateAfterFilterInput").type(
      usersFilteredByBirthDate.filter.birthDateAfter
    );
    cy.get("@birthDateBeforeFilterInput").type(
      usersFilteredByBirthDate.filter.birthDateBefore
    );

    cy.wait("@filterRequest");

    for (let user of usersFilteredByBirthDate.data) {
      cy.findByRole("listitem", {
        name: user.email,
      })
        .should("contain", user.email)
        .and("contain", user.name)
        .and("contain", user.birthDate);

      expect(new Date(user.birthDate)).to.be.gte(
        new Date(usersFilteredByBirthDate.filter.birthDateAfter)
      );
      expect(new Date(user.birthDate)).to.be.lte(
        new Date(usersFilteredByBirthDate.filter.birthDateBefore)
      );
    }
  });

  it("should filter users by all fields", function () {
    cy.get("@nameFilterInput").should("have.value", "");
    cy.get("@emailFilterInput").should("have.value", "");
    cy.get("@birthDateAfterFilterInput").should("have.value", "");
    cy.get("@birthDateBeforeFilterInput").should("have.value", "");

    cy.get("@nameFilterInput").type(usersFilteredByAllFields.filter.name);
    cy.get("@emailFilterInput").type(usersFilteredByAllFields.filter.email);
    cy.get("@birthDateAfterFilterInput").type(
      usersFilteredByAllFields.filter.birthDateAfter
    );
    cy.get("@birthDateBeforeFilterInput").type(
      usersFilteredByAllFields.filter.birthDateBefore
    );

    cy.wait("@filterRequest");

    for (let user of usersFilteredByAllFields.data) {
      cy.findByRole("listitem", {
        name: user.email,
      })
        .should("contain", user.email)
        .and("contain", user.name)
        .and("contain", user.birthDate);

      expect(user.name).to.include(usersFilteredByAllFields.filter.name);
      expect(user.email).to.include(usersFilteredByAllFields.filter.email);
      expect(new Date(user.birthDate)).to.be.gte(
        new Date(usersFilteredByAllFields.filter.birthDateAfter)
      );
      expect(new Date(user.birthDate)).to.be.lte(
        new Date(usersFilteredByAllFields.filter.birthDateBefore)
      );
    }
  });
});
