describe('product delete test', () => {
    it('visits the product page and deletes a product', () => {
    cy.visit('/');
    cy.get('button').click();
    cy.contains('a', 'Products').click();
    cy.contains('D9000').click();
    cy.get('button').contains('Delete').click();
    cy.get('button').contains('Yes').click();
    cy.contains('deleted.');
    });
   });