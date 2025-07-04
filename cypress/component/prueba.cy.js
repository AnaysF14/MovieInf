import { defineConfig } from 'cypress'
import { startDevServer } from '@cypress/webpack-dev-server'

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('dev-server:start', (options) => {
        return startDevServer({ options })
      })
      return config
    },
    specPattern: 'cypress/component/**/*.cy.{js,jsx,ts,tsx}', // Ruta para las pruebas de componentes
  },
})
