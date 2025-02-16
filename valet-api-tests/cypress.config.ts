// cypress.config.ts
import { defineConfig } from 'cypress';
import mochawesome from 'cypress-mochawesome-reporter/plugin';
import allureWriter from '@shelex/cypress-allure-plugin/writer';

export default defineConfig({
  e2e: {
    baseUrl: 'https://www.bankofcanada.ca/valet',
    // Adjust specPattern if needed:
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
  // Primary reporter set to Mochawesome:
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,                // Enable charts in the report.
    reportPageTitle: 'Valet API Test Report',
    embeddedScreenshots: true,   // Embed screenshots directly into the report.
    inlineAssets: true,          // Inline CSS and JS for portability.
    reportFilename: '[name]-report',
    overwrite: false,
    timestamp: 'mmddyyyy_HHMMss'
  },
  // Enable Allure reporting via environment variable.
  env: {
    allure: true
  }
});
