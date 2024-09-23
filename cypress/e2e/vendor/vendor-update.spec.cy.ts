describe('vendor update test', () => {
	it('visits the vendor page and updates a vendor', () => {
	cy.visit('/');
	cy.get('button').click();
	cy.contains('a', 'Vendors').click();
	cy.contains('Mike').click();
	cy.get("[type='email']").clear();
	cy.get("[type='email']").type('someemail@domain.com');
	cy.get('form').submit();
	cy.contains('updated!');
	});
   });