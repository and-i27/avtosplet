describe('Registration', () => {
  it('should register a new user', () => {
    // Visit the home page
    cy.visit('http://localhost:3000')

    // Navigate to the login page
    cy.get('a[href*="login"]').click()

    // Navigate to the registration page
    cy.get('a[href*="login/register"]').click()

    // Fill out the registration form
    cy.get('input[placeholder="Name"]').type('tester')
    cy.get('input[placeholder="Email"]').type('tester4@test.com')
    cy.get('input[placeholder="Password"]').type('tester1234')
    cy.get('button[type="submit"]').click()

    // check if alert is shown with success message
    cy.on('window:alert', (str) => {
      expect(str).to.contains('Registration successful! You can now log in.')
    })
  })
})