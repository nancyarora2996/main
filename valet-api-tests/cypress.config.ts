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
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,                // Enable charts (default pie chart)
    reportPageTitle: 'Valet API Test Report',
    embeddedScreenshots: true,   // Embed screenshots in the report
    inlineAssets: true,          // Inline CSS and JS for portability
    reportFilename: 'Report', // Custom report name; timestamp will be appended
    overwrite: false,
    timestamp: 'mmddyyyy_HHMMss'
  },
  env: {
    allure: true // Enable Allure reporting.
  }
});
