import VehicleFilter from '@/app/components/VehicleFilter'

describe('<VehicleFilter />', () => {
  it('loads options, enables model select, and navigates on search', () => {
    cy.mount(<VehicleFilter />)

    // Brands loaded
    cy.contains('option', 'BMW').should('exist')
    cy.contains('option', 'Audi').should('exist')

    // Model disabled initially
    cy.get('select').eq(1).should('be.disabled')

    // Select brand
    cy.get('select').eq(0).select('BMW')

    // Model enabled + populated
    cy.get('select').eq(1).should('not.be.disabled')
    cy.contains('option', 'X5').should('exist')

    // Select model
    cy.get('select').eq(1).select('X5')

    // Fill some numeric fields
    cy.get('input[placeholder="Min cena"]').type('5000')
    cy.get('input[placeholder="Max cena"]').type('15000')

    // Click search
    cy.contains('button', 'IŠČI').click()

    // Assert navigation
    cy.get('@routerPush').should(
      'have.been.calledWithMatch',
      /\/search\?.*brand=brand1.*model=model1.*minPrice=5000.*maxPrice=15000/
    )
  })
})
