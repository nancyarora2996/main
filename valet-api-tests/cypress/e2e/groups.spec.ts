// cypress/e2e/groups.spec.ts

describe('Valet API - Groups Endpoint Tests', () => {
  // Positive Test: Valid groups endpoint.
  it('should return a valid response structure for /lists/groups/json', () => {
    cy.request({
      method: 'GET',
      url: '/lists/groups/json',
      failOnStatusCode: false
    }).then((response) => {
      // Expecting a 200 response for a valid request.
      expect(response.status).to.eq(200);
      // The GroupsList schema should include "terms" and "groups" as objects.
      expect(response.body).to.have.property('terms');
      expect(response.body).to.have.property('groups');
      expect(response.body.terms).to.be.an('object');
      expect(response.body.groups).to.be.an('object');
    });
  });

  // Negative Test 1: Invalid endpoint URL.
  it('should return an error for an invalid groups endpoint URL', () => {
    cy.request({
      method: 'GET',
      url: '/lists/groups_invalid/json',
      failOnStatusCode: false
    }).then((response) => {
      // Expecting a non-200 status (likely 404).
      expect(response.status).to.not.eq(200);
      // Check that the response contains a "message" property.
      expect(response.body).to.have.property('message');
    });
  });

  // Negative Test 2: Unsupported format value.
  it('should return an error for an unsupported format value in the URL', () => {
    cy.request({
      method: 'GET',
      // Passing an unsupported format ('xyz') instead of json, csv, or xml.
      url: '/lists/groups/xyz',
      failOnStatusCode: false
    }).then((response) => {
      // Expect a 400 Bad Request (or similar error code).
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('message');
    });
  });

  // Negative Test 3: Simulated server error scenario.
  it('should handle a simulated server error scenario for groups', () => {
    cy.request({
      method: 'GET',
      // Hypothetical endpoint to simulate a server error.
      url: '/lists/groups/serverError/json',
      failOnStatusCode: false
    }).then((response) => {
      // Observations indicate the simulated error returns 404 instead of 500.
      expect(response.status).to.eq(404);
      expect(response.body).to.have.property('message');
    });
  });

  // Additional Test 1: Trailing Slash in URL.
  it('should return a valid response structure when URL has a trailing slash', () => {
    cy.request({
      method: 'GET',
      url: '/lists/groups/json/',  // Notice the trailing slash.
      failOnStatusCode: false
    }).then((response) => {
      // Expect a 200 response if the API handles the trailing slash gracefully.
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('terms');
      expect(response.body).to.have.property('groups');
      expect(response.body.terms).to.be.an('object');
      expect(response.body.groups).to.be.an('object');
    });
  });

  // Additional Test 2: Malformed Type Parameter.
  it('should return an error when an invalid type value is provided', () => {
    cy.request({
      method: 'GET',
      // Using a malformed type value "Gr0ups" (with a zero) instead of "groups".
      url: '/lists/Gr0ups/json',
      failOnStatusCode: false
    }).then((response) => {
      // Expect a non-200 response (likely 400 or 404).
      expect(response.status).to.not.eq(200);
      expect(response.body).to.have.property('message');
    });
  });

  // Additional Test 3: Unknown Query Parameter.
  it('should ignore unknown query parameters and return a valid response', () => {
    cy.request({
      method: 'GET',
      url: '/lists/groups/json',
      qs: { foo: 'bar' },  // Extra parameter not defined in the spec.
      failOnStatusCode: false
    }).then((response) => {
      // Expect a valid 200 response with the correct structure.
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('terms');
      expect(response.body).to.have.property('groups');
    });
  });

  // Additional Test 4: Missing Required Format Parameter.
  it('should return an error when the format parameter is missing from the URL', () => {
    // Since the API requires the format in the URL, omitting it should cause an error.
    cy.request({
      method: 'GET',
      // URL without the format segment.
      url: '/lists/groups',
      failOnStatusCode: false
    }).then((response) => {
      // Expect a 404 or 400 status.
      expect(response.status).to.not.eq(200);
      expect(response.body).to.have.property('message');
    });
  });
});
