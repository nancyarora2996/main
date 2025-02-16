// cypress/support/e2e.ts

// ***********************************************************
// This file is processed and loaded automatically before your test files.
//
// Use this file to put global configuration and behavior that modifies Cypress.
// You can change the location of this file or turn off automatically serving support files with the
// 'supportFile' configuration option in cypress.config.ts.
// ***********************************************************

// Import custom commands if you have any (optional)
// For example: import './commands'

// Global event handler to prevent Cypress from failing the test on uncaught exceptions.
// This can be useful if your API might occasionally throw an error that you intend to handle in your tests.
Cypress.on('uncaught:exception', (err, runnable) => {
    // Returning false here prevents Cypress from failing the test on uncaught exceptions.
    // Adjust this if you want to handle certain exceptions differently.
    return false;
  });
  
  // Additional global configurations or hooks can be added here as needed.
  