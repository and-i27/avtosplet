import VehicleCard from "../components/VehicleCard";
import {client} from "@/sanity/lib/client";
import { VEHICLE_QUERY } from '../../sanity/lib/queries';

export default async function Home() {

const posts = await client.fetch(VEHICLE_QUERY)
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
