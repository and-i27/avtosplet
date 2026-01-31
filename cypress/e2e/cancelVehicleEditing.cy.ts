describe('cancel vehicle editing', () => {
  it('should cancel vehicle editing and return to profile', () => {
    // Visit the home page
    cy.visit('http://localhost:3000')

    // Log in first
    // Navigate to the login page
    cy.get('a[href*="login"]').click()

    // Fill out the login form
    cy.get('input[placeholder="Email"]').type('tester@test.com')
    cy.get('input[placeholder="Password"]').type('tester1234')
    cy.get('button[type="submit"]').click()

    // Navigate to the vehicle editing page
    cy.get('a[href*="profile"]').click()
    cy.get('a').contains('Edit').first().click()

    // Click the cancel button
    cy.get('button').contains('Prekliči').click()

    // Verify that we are back on the profile page
    cy.url().should('include', '/profile')

    // write to console
    cy.log('Cancel vehicle editing test completed successfully')
  })
})