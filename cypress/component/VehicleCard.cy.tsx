import VehicleCard from "@/app/components/VehicleCard"

const vehicle = {
  _id: "vehicle123",
  views: 150,
  user: {
    _id: "user456",
    name: "John Doe",
  },
  brand: "Toyota",
  model: "Corolla",
  price: 20000,
  year: 2020,
  kilometers: 15000,
  fuel: "Gasoline",
  gearbox: "Automatic",
  images: [{ asset: { url: "/test-image.jpg" } }],
}

describe('VehicleCard', () => {
  it('renders vehicle card', () => {
    cy.mount(<VehicleCard post={vehicle} />)
  })
})