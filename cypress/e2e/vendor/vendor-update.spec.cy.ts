describe('vendor update test', () => {
	it('visits the vendor page and updates a vendor', () => {
	cy.visit('/');
	cy.get('button').click();
	cy.contains('a', 'Vendors').click();
	cy.contains('Vendy').click();
	cy.get("[type='email']").clear();
	cy.get("[type='email']").type('newsomeemail@domain.com');
	cy.get('form').submit();
	cy.contains('updated.');
	});
   });