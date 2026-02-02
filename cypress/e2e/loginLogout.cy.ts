describe('login and logout', () => {
  it('should log in the user and log them out', () => {
    // Visit the home page
    cy.visit('http://localhost:3000')

    // Navigate to the login page
    cy.get('a[href*="login"]').click()

    // Fill out the login form
    cy.get('input[placeholder="Email"]').type('tester@test.com')
    cy.get('input[placeholder="Password"]').type('tester1234')
    cy.get('button[type="submit"]').click()

    // Check if the user is logged in by looking for the logout button
    cy.get('button').contains('Logout').should('be.visible')

    // Log out the user
    cy.get('button').contains('Logout').click()

    // Check if the user is logged out by looking for the login link
    cy.get('a[href*="login"]').should('be.visible')

    // write to console
    cy.log('Login and logout test completed successfully')
  })
})