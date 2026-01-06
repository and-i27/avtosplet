import HomePage from '@/app/components/home'

describe('<HomePage />', () => {
  it('renders expected content', () => {
    cy.mount(<HomePage />)

    cy.get('h1').contains('Najdi svoje vozilo')
    cy.get('a[href="/search"]').should('be.visible')
  })
})
