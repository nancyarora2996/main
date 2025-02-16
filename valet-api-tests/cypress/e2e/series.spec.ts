// cypress/e2e/series.spec.ts

describe('Valet API - Series Tests', () => {
  // Helper to compute average of an array of numbers.
  const computeAverage = (values: number[]): number => {
    const total = values.reduce((sum, num) => sum + num, 0);
    return total / values.length;
  };

  // Helper: format date as YYYY-MM-DD.
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // Reusable function to test various currency pairs.
  const testCurrencyPair = (seriesId: string, label: string) => {
    it(`should get the average rate for ${label} over the past 10 weeks`, () => {
      const endDate = new Date();
      const startDate = new Date();
      // ~10 weeks = 70 days.
      startDate.setDate(endDate.getDate() - 70);

      cy.request({
        method: 'GET',
        url: `/observations/${seriesId}/json`,
        qs: {
          start_date: formatDate(startDate),
          end_date: formatDate(endDate)
        },
        failOnStatusCode: false
      }).then((response) => {
        // Positive scenario: expecting a 200.
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('observations');
        const observations = response.body.observations;
        expect(observations).to.be.an('array').and.have.length.greaterThan(0);

        // Extract numeric rates from observations.
        const rates: number[] = observations
          .map((obs: any) => parseFloat(obs[seriesId]))
          .filter((rate: number) => !isNaN(rate));

        expect(rates.length).to.be.greaterThan(0, 'Rates array should have numeric values');
        const avgRate = computeAverage(rates);
        cy.log(`Average rate for ${label} (last 10 weeks): ${avgRate}`);
        expect(avgRate).to.be.greaterThan(0);
      });
    });
  };

  // Positive scenarios.
  testCurrencyPair('FXCADUSD', 'CAD to USD');
  testCurrencyPair('FXCADEUR', 'CAD to EUR');

  // Negative Test 1: Invalid series code.
  it('should return an error for an invalid series code', () => {
    cy.request({
      method: 'GET',
      url: '/observations/INVALID_SERIES/json',
      failOnStatusCode: false
    }).then((response) => {
      // Expecting non-200 (400 or 404) status.
      expect(response.status).to.not.eq(200);
      // Check for the error message property.
      expect(response.body).to.have.property('message');
    });
  });

  // Negative Test 2: Invalid date range (start_date > end_date).
  it('should return an error for an invalid date range', () => {
    const endDate = new Date();
    const startDate = new Date();
    // Set start date to one day after end date.
    startDate.setDate(endDate.getDate() + 1);

    cy.request({
      method: 'GET',
      url: '/observations/FXCADUSD/json',
      qs: {
        start_date: formatDate(startDate),
        end_date: formatDate(endDate)
      },
      failOnStatusCode: false
    }).then((response) => {
      // Depending on the API, you might receive a 400 Bad Request.
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('message');
    });
  });

  // Negative Test 3: Simulating a server error (500).
  it('should handle a server error (500) scenario', () => {
    cy.request({
      method: 'GET',
      url: '/observations/serverError/json', // hypothetical endpoint for demonstration.
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(500);
      expect(response.body).to.have.property('message');
    });
  });
});
