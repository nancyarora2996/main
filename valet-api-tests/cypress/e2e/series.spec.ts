// cypress/e2e/series.spec.ts

describe('Valet API - Series Tests', () => {
  // Helper to compute the average of an array of numbers.
  const computeAverage = (values: number[]): number => {
    const total = values.reduce((sum, num) => sum + num, 0);
    return total / values.length;
  };

  // Helper: format date as YYYY-MM-DD.
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // Reusable function to test a currency pair.
  const testCurrencyPair = (seriesId: string, label: string) => {
    it(`should get the average rate for ${label} over the past 10 weeks`, () => {
      const endDate = new Date();
      const startDate = new Date();
      // ~10 weeks = 70 days.
      startDate.setDate(endDate.getDate() - 70);

      cy.request({
        method: 'GET',
        // Include the format in the URL path.
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
        // Expected structure: { d: "YYYY-MM-DD", <seriesId>: { v: "0.7443" } }
        const rates: number[] = observations
          .map((obs: any) => {
            const rateObj = obs[seriesId];
            return rateObj && rateObj.v ? parseFloat(rateObj.v) : NaN;
          })
          .filter((rate: number) => !isNaN(rate));

        expect(rates.length).to.be.greaterThan(0, 'Rates array should have numeric values');
        const avgRate = computeAverage(rates);
        cy.log(`Average rate for ${label} (last 10 weeks): ${avgRate}`);
        expect(avgRate).to.be.greaterThan(0);
      });
    });
  };

  // Define an array of currency pairs.
  const currencyPairs = [
    { seriesId: 'FXCADUSD', label: 'CAD to USD' },
    { seriesId: 'FXCADEUR', label: 'CAD to EUR' },
    { seriesId: 'FXCADGBP', label: 'CAD to GBP' } // Add more pairs as needed.
  ];

  // Run the positive test for each currency pair.
  currencyPairs.forEach(pair => {
    testCurrencyPair(pair.seriesId, pair.label);
  });

  // Additional Test 1: Default behavior when no date range or recent parameter is provided.
  it('should return a default set of observations when no date range or recent parameter is provided', () => {
    cy.request({
      method: 'GET',
      url: `/observations/FXCADUSD/json`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('observations');
      const observations = response.body.observations;
      expect(observations).to.be.an('array').and.have.length.greaterThan(0);
    });
  });

  // Negative Test 1: Invalid series code.
  it('should return an error for an invalid series code', () => {
    cy.request({
      method: 'GET',
      url: `/observations/INVALID_SERIES/json`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.not.eq(200);
      expect(response.body).to.have.property('message');
    });
  });

  // Negative Test 2: Invalid date range (start_date > end_date).
  it('should return an error for an invalid date range', () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() + 1); // Start date is after end date.

    cy.request({
      method: 'GET',
      url: `/observations/FXCADUSD/json`,
      qs: {
        start_date: formatDate(startDate),
        end_date: formatDate(endDate)
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('message');
    });
  });

  // Negative Test 3: Simulated server error scenario.
  it('should handle a simulated server error scenario', () => {
    cy.request({
      method: 'GET',
      url: `/observations/serverError/json`, // Hypothetical endpoint.
      failOnStatusCode: false
    }).then((response) => {
      // In our environment, the simulated error returns 404.
      expect(response.status).to.eq(404);
      expect(response.body).to.have.property('message');
    });
  });

  // Additional Test 2: Using the "recent" parameter.
  it('should return at most the specified number of recent observations when "recent" is provided', () => {
    const recentCount = 5;
    cy.request({
      method: 'GET',
      url: `/observations/FXCADUSD/json`,
      qs: { recent: recentCount },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('observations');
      const observations = response.body.observations;
      expect(observations).to.be.an('array');
      expect(observations.length).to.be.at.most(recentCount);
    });
  });

  // Additional Test 3: Order Direction parameter (ascending order).
  it('should return observations in ascending order when order_dir is set to asc', () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 70);
    cy.request({
      method: 'GET',
      url: `/observations/FXCADUSD/json`,
      qs: {
        start_date: formatDate(startDate),
        end_date: formatDate(endDate),
        order_dir: 'asc'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('observations');
      const observations = response.body.observations;
      expect(observations).to.be.an('array').and.have.length.greaterThan(0);
      const dates = observations.map((obs: any) => new Date(obs.d));
      const sortedDates = [...dates].sort((a, b) => a.getTime() - b.getTime());
      expect(dates).to.deep.equal(sortedDates);
    });
  });

  // Additional Test 4: Conflict between recent and date range parameters.
  it('should return an error when both "recent" and "start_date"/"end_date" are provided', () => {
    const recentCount = 5;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 70);
    cy.request({
      method: 'GET',
      url: `/observations/FXCADUSD/json`,
      qs: {
        recent: recentCount,
        start_date: formatDate(startDate),
        end_date: formatDate(endDate)
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('message');
    });
  });

  // Additional Test 5: Invalid order_dir value.
  it('should return an error for an invalid order_dir parameter', () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 70);
    cy.request({
      method: 'GET',
      url: `/observations/FXCADUSD/json`,
      qs: {
        start_date: formatDate(startDate),
        end_date: formatDate(endDate),
        order_dir: 'invalid'  // Unsupported value.
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('message');
    });
  });

  // Additional Test 6: Boundary condition when start_date equals end_date.
  it('should return observations for the exact date when start_date equals end_date', () => {
    const date = new Date();
    const formattedDate = formatDate(date);
    cy.request({
      method: 'GET',
      url: `/observations/FXCADUSD/json`,
      qs: {
        start_date: formattedDate,
        end_date: formattedDate
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('observations');
      expect(response.body.observations).to.be.an('array');
    });
  });
});
