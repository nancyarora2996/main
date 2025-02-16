// cypress.config.ts
import { defineConfig } from 'cypress';
import mochawesome from 'cypress-mochawesome-reporter/plugin';
import allureWriter from '@shelex/cypress-allure-plugin/writer';

export default defineConfig({
  e2e: {
    baseUrl: 'https://www.bankofcanada.ca/valet',
    specPattern: 'cypress/e2e/**/*.spec.{js,jsx,ts,tsx}',
    defaultCommandTimeout: 10000,
    requestTimeout: 15000,
    // Capture screenshots on failure is enabled by default; 
    screenshotOnRunFailure: true,
    video: false,
    setupNodeEvents(on, config) {
      // Set up Mochawesome Reporter plugin.
      mochawesome(on);
      // Set up Allure Reporter plugin.
      allureWriter(on, config);
      return config;
    }
  },
  // Primary reporter set to Mochawesome.
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,                // Enable charts in the report.
    reportPageTitle: 'Valet API Test Report',
    embeddedScreenshots: true,   // Embed screenshots directly in the HTML report.
    inlineAssets: true,          // Inline CSS and JS assets for portability.
    reportFilename: 'Report', // Custom report name with a timestamp.
    overwrite: false,
    timestamp: 'mmddyyyy_HHMMss'  // Timestamp format appended to the report name.
  },
  env: {
    allure: true // Enable Allure reporting.
  }
});
