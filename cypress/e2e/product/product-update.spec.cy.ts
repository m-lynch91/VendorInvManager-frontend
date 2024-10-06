describe('product update test', () => {
	it('visits the product page and updates an product', () => {
	cy.visit('/');
	cy.get('button').click();
	cy.contains('a', 'Products').click();
	cy.contains('1').click();
    cy.get('input[formcontrolname=purchaseprice').clear();
    cy.get('input[formcontrolname=purchaseprice').click({ force: true }).type('60.00');
	cy.get('button').contains('Save').click();
	cy.contains('updated');
	});
   });