import VehicleCard from "../components/VehicleCard";

export default function Home() {
  const posts = [
    {
      _cratedAt: new Date(),
      views: 55,
      author: { _id: 1, name: "Andi" },
      _id: 1,
      description: "To je opis",
      image:
        "https://hips.hearstapps.com/hmg-prod/images/original-13270-s7-2024-6701-66d8a83a30973.jpg?crop=0.647xw:0.458xh;0.122xw,0.247xh&resize=1200:*",
      category: "Car",
      title: "Audi A5",
    },
    {
      _cratedAt: new Date(),
      views: 42,
      author: { _id: 2, name: "Maja" },
      _id: 2,
      description: "Drugi opis vozila",
      image:
        "https://hips.hearstapps.com/hmg-prod/images/original-13270-s7-2024-6701-66d8a83a30973.jpg?crop=0.647xw:0.458xh;0.122xw,0.247xh&resize=1200:*",
      category: "SUV",
      title: "BMW X5",
    },
    // Add more posts here...
  ];

  return (
    <>
      <h1 className="text-2xl font-semibold mb-5">Home</h1>
      <section className="section_container px-4">
        {posts?.length > 0 ? (
          <ul className="vehicle-grid grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {posts.map((post) => (
              <VehicleCard key={post._id} post={post} />
            ))}
          </ul>
        ) : (
          <p className="no-results text-gray-500">Ni najdenih vozil</p>
        )}
      </section>
    </>
  );
}
