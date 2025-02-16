import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'https://www.bankofcanada.ca/valet',
    specPattern: 'cypress/e2e/**/*.spec.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      // Add the Mochawesome reporter plugin
      require('cypress-mochawesome-reporter/plugin')(on);
      return config;
    }
    
  },
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,
    reportPageTitle: 'Valet API Test Report',
    embeddedScreenshots: true,
    inlineAssets: true
  }
});
