describe('vendor add test', () => {
	it('visits the vendor page and adds an vendor', () => {
	cy.visit('/');
	cy.get('button').click();
	cy.contains('a', 'Vendors').click();
	cy.contains('control_point').click();
	cy.get('input[formcontrolname=name').click({ force: true }).type('Vendy');
	cy.get('input[formcontrolname=address').click({ force: true }).type('111 main st');
	cy.get('input[formcontrolname=city').click({ force: true }).type('Toronto');
	cy.get('mat-select[formcontrolname="province"]').click({ force: true });
	cy.get('mat-option').contains('Ontario').click();
	cy.get('input[formcontrolname=postalCode').click({ force: true }).type('1A1 A1A');
	cy.get('input[formcontrolname=phone').click({ force: true }).type('(111)111-1111');
	cy.get('input[formcontrolname=type').click({ force: true }).type('Trusted');
	cy.get('input[formcontrolname=email').click({ force: true }).type('vm@here.com');
	cy.get('button').contains('Save').click();
	cy.contains('added.');
	});
   });