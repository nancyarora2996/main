// cypress/e2e/groups.spec.ts

describe('Valet API - Groups Endpoint Tests', () => {
  // Positive Test: Valid groups endpoint.
  it('should return a valid response structure for /lists/groups/json', () => {
    cy.request({
      method: 'GET',
      url: '/lists/groups/json',
      failOnStatusCode: false
    }).then((response) => {
      // Expect a successful response (200)
      expect(response.status).to.eq(200);
      // The valid response should include a "terms" property.
      expect(response.body).to.have.property('terms');
      // "terms" should be an array.
      expect(response.body.terms).to.be.an('array');
      if (response.body.terms.length > 0) {
        // Depending on the API, each term might be a string or an object.
        // Here we assume it's a string. Adjust if needed.
        expect(response.body.terms[0]).to.be.a('string');
      }
    });
  });

  // Negative Test 1: Invalid endpoint URL.
  it('should return an error for an invalid groups endpoint URL', () => {
    cy.request({
      method: 'GET',
      url: '/lists/groups_invalid/json',
      failOnStatusCode: false
    }).then((response) => {
      // Expect a non-200 status (e.g., 404)
      expect(response.status).to.not.eq(200);
      // Check that the response contains an error message.
      expect(response.body).to.have.property('message');
    });
  });

  // Negative Test 2: Invalid query parameter (simulate unsupported format).
  it('should return an error for an unsupported format query parameter', () => {
    cy.request({
      method: 'GET',
      url: '/lists/groups/json',
      qs: { format: 'xml' }, // Assuming the endpoint only supports JSON.
      failOnStatusCode: false
    }).then((response) => {
      // Expect a non-200 status (likely 400 or 404)
      expect(response.status).to.not.eq(200);
      // Check that the error response contains a message.
      expect(response.body).to.have.property('message');
    });
  });

  // Negative Test 3: Simulating a server error.
  // This is a hypothetical endpoint for demonstration purposes.
  it('should handle a server error (500) scenario for groups', () => {
    cy.request({
      method: 'GET',
      url: '/lists/groups/serverError/json', // Hypothetical endpoint
      failOnStatusCode: false
    }).then((response) => {
      // Expect the simulated server error to return status 500.
      expect(response.status).to.eq(500);
      expect(response.body).to.have.property('message');
    });
  });
});
