import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}', // Ajusta esta ruta si es necesario
    setupNodeEvents(on, config) {
      // Este es un ejemplo de configuración que imprime un mensaje en la consola
      on('before:run', () => {
        console.log('Antes de ejecutar las pruebas');
      });
      return config;
    },
  },
});
