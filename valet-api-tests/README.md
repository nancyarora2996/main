# Valet API Tests

This project is a lightweight API automation framework built using Cypress with TypeScript. It tests the [Bank of Canada Valet API](https://www.bankofcanada.ca/valet/docs) and validates both positive and negative scenarios. The primary objective is to calculate the average Forex conversion rate for "CAD to USD" over the recent 10 weeks using the observations endpoint. Additional tests for other currency pairs and for the groups endpoint have been added to demonstrate code reusability and thorough error handling.

## Features

- **API Testing:** Automated tests against the Bank of Canada Valet API.
- **Modular and Reusable Code:** Uses helper functions for date formatting, average calculation, and reusable functions that run the same test logic for various currency pairs.
- **Comprehensive Scenarios:** Covers positive cases (such as calculating averages for valid currency pairs) and negative cases (such as invalid series codes, invalid date ranges, conflicting parameters, and simulated server errors).
- **Multiple Currency Support:** Easily extended tests for various currency pairs (e.g., CAD to USD, CAD to EUR, CAD to GBP, etc.).
- **Edge Case Coverage:** Additional tests cover default behavior, parameter conflicts, ordering, boundary conditions, and unknown query parameters.
- **HTML Reporting:** Generates detailed test reports using [cypress-mochawesome-reporter](https://www.npmjs.com/package/cypress-mochawesome-reporter) with embedded screenshots.
- **Global Configurations:** Centralized error handling and logging in the Cypress support file.

## Project Structure

- **cypress/e2e:** Contains test files such as `series.spec.ts` and `groups.spec.ts` which cover both Series and Groups endpoints.
- **cypress/support:** Holds global configuration files (e.g., `e2e.ts`) and any custom commands.
- **cypress.config.ts:** Contains Cypress configuration including the base URL, timeouts, and reporter settings.
- **Other files:** Includes `package.json` for project metadata and scripts, and `tsconfig.json` for TypeScript configuration.

## Reports and Logs

- **HTML Reports:** Detailed test reports are generated by cypress-mochawesome-reporter, including embedded screenshots for failed tests.
- **Logs:** Custom logs can be generated with `cy.log()`, and global logging is configured in the Cypress support file.

## Test Scenarios

### Series Tests

- **Positive Scenarios:**  
  Tests calculate the average rate for various currency pairs (e.g., CAD to USD, CAD to EUR, CAD to GBP) over the past 10 weeks by reusing the same test logic via a helper function.  
- **Additional Edge Cases:**  
  - **Default Behavior:** Verifies that if no date range or recent parameter is provided, a default set of observations is returned.  
  - **Using the "recent" Parameter:** Confirms that the API returns at most the requested number of recent observations.  
  - **Order Direction:** Validates that observations are returned in ascending order when `order_dir=asc` is specified.  
  - **Conflicting Parameters:** Checks that providing both `recent` and `start_date`/`end_date` parameters results in an error.  
  - **Invalid `order_dir`:** Ensures an unsupported order direction returns an error.  
  - **Boundary Condition:** Verifies the behavior when `start_date` equals `end_date`.

- **Negative Scenarios:**  
  - Invalid series code returns an error.
  - Invalid date ranges (start_date later than end_date) return an error.
  - Simulated server error endpoints return appropriate error messages.

### Groups Tests

- **Positive Scenario:**  
  Validates that the `/lists/groups/json` endpoint returns the correct JSON structure according to the GroupsList schema (including `terms` and `groups` properties).
- **Additional Edge Cases:**  
  - **Trailing Slash:** Verifies that a trailing slash in the URL does not affect the response.
  - **Malformed Type Parameter:** Ensures that an invalid type value returns an error.
  - **Unknown Query Parameter:** Checks that extra, unknown query parameters are ignored.
  - **Missing Format Parameter:** Tests the behavior when the required format segment is missing (the API may default to JSON).

- **Negative Scenarios:**  
  - An invalid endpoint URL returns an error.
  - An unsupported format value in the URL returns an error.
  - A simulated server error scenario returns an appropriate error.

## Potential Enhancements

- **CI/CD Integration:**  
  Automate test execution via tools like GitHub Actions, GitLab CI, or Jenkins to run tests on every push or pull request.

- **Expanded Negative Testing:**  
  Add more negative test cases for invalid or missing query parameters, unexpected data types, network timeouts, and rate limiting scenarios.

- **Parameterization and Data-Driven Testing:**  
  Externalize test data (e.g., currency pairs, date ranges) using environment variables or external JSON/CSV files for easier test configuration.

- **Custom Commands and Utilities:**  
  Develop reusable custom commands in `cypress/support/commands.ts` to handle common tasks such as setting request headers and authentication.

- **Enhanced Reporting:**  
  Integrate with additional reporting tools (e.g., Allure) for deeper insights into test performance and failures.

- **Performance Testing:**  
  Measure response times and throughput to identify API bottlenecks.

- **Extended API Coverage:**  
  Add tests for other endpoints (such as indicators, group details, or RSS feeds) and for different response formats (e.g., CSV, XML).

- **Error Handling and Retry Logic:**  
  Implement retry mechanisms for transient network issues and enhance error reporting to simplify debugging.

- **Security Testing:**  
  Add basic security tests to verify authentication, authorization, and that sensitive information is not exposed.


 
 
 
