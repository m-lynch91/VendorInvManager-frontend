describe('Product add test', () => {
	it('Visits the product page and adds an product', () => {
	cy.visit('/');
	cy.get('button').click();
	cy.contains('a', 'Products').click();
	cy.contains('control_point').click();
	cy.get('input[formcontrolname="id"]').click({ force: true }).type('D9000');
	cy.get('mat-select[formcontrolname="vendorid"]').click({ force: true });
	cy.get('mat-option').contains('Shady Sams').click();
	cy.get('input[formcontrolname="name"]').click({ force: true }).type('Lawn Dart');
	cy.get('input[formcontrolname="purchaseprice"]').clear();
	cy.get('input[formcontrolname="purchaseprice"]').click({ force: true }).type('50.00');
	cy.get('input[formcontrolname="msrp"]').clear();
	cy.get('input[formcontrolname="msrp"]').click({ force: true }).type('40.00');
	cy.get('.mat-expansion-indicator').eq(0).click();
	cy.get('input[formcontrolname="reorderpoint"]').clear();
	cy.get('input[formcontrolname="reorderpoint"]').click({ force: true }).type('9');
	cy.get('input[formcontrolname="economicorderquantity"]').clear();
	cy.get('input[formcontrolname="economicorderquantity"]').click({ force: true }).type('9');
	cy.get('input[formcontrolname="quantityonhand"]').clear();
	cy.get('input[formcontrolname="quantityonhand"]').click({ force: true }).type('3');
	cy.get('input[formcontrolname="quantityonorder"]').clear();
	cy.get('input[formcontrolname="quantityonorder"]').click({ force: true }).type('7');
	cy.get('.mat-expansion-indicator').eq(1).click();
	cy.get('button').contains('Save').click();
	cy.contains('added');
	});
   });