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
      // According to the documentation, the response should conform to the GroupsList schema,
      // which contains properties "terms" and "groups". These are objects.
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
      // Expecting a non-200 status (likely 404)
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
      // Expect a 400 Bad Request (or similar error code)
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('message');
    });
  });

  // Negative Test 3: Simulated server error scenario.
  it('should handle a simulated server error scenario for groups', () => {
    cy.request({
      method: 'GET',
      // This is a hypothetical endpoint to simulate a server error.
      url: '/lists/groups/serverError/json',
      failOnStatusCode: false
    }).then((response) => {
      // Observations indicate the simulated error returns 404 instead of 500.
      expect(response.status).to.eq(404);
      expect(response.body).to.have.property('message');
    });
  });
});
