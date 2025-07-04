// src/cypress/integration/2_U/mi_pruebaE2E.spec.js

describe('Mi prueba E2E', () => {
  it('Debería cargar la página correctamente', () => {
    cy.visit('https://movieinf.vercel.app'); // Cambia la URL si tu aplicación está en otro puerto
    cy.contains('¡Bienvenido!').should('be.visible'); // Verifica si el texto aparece en la pantalla
  });

  it('Debería navegar a la página de películas', () => {
    cy.visit('https://movieinf.vercel.app'); // Asegúrate de que la página de inicio se carga
    cy.get('button').contains('Películas').click(); // Clic en el botón "Películas"
    cy.url().should('include', '/peliculas'); // Verifica que la URL cambió
  });
});
