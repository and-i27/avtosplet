import { client } from "@/sanity/lib/client";
import { VEHICLE_BY_ID_QUERY } from "@/sanity/lib/queries";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type VehicleTypeDetail = {
  _id: string;
  brand: string;
  model: string;
  price: number;
  year: number;
  kilometers: number;
  fuel: string;
  gearbox: string;
  doors?: string;
  seats?: number;
  color?: string;
  description?: string;
  images?: { asset: { url: string } }[];
  views: number;
  user: {
    _id: string;
    name: string;
  };
};

type VehiclePageProps = {
  params: Promise<{ id: string }>;
};

export default async function VehicleDetailPage({ params }: VehiclePageProps) {
  const { id } = await params;

  if (!id) {
    return <p className="text-gray-500">Vozilo ni najdeno.</p>;
  }

  const vehicle = await client.fetch<VehicleTypeDetail | null>(
    VEHICLE_BY_ID_QUERY,
    { id }
  );

  if (!vehicle) {
    return <p className="text-gray-500">Vozilo ni najdeno.</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Title */}
      <h1 className="text-3xl font-bold">{vehicle.brand} {vehicle.model}</h1>

      {/* Images slider (simplified as stacked images) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vehicle.images && vehicle.images.length > 0 ? (
          vehicle.images.map((img, index) => (
            <Image
              key={index}
              src={img.asset.url}
              alt={`${vehicle.brand} ${vehicle.model} image ${index + 1}`}
              width={600}
              height={400}
              className="rounded-xl object-cover w-full h-64 md:h-80"
            />
          ))
        ) : (
          <Image
            src="/placeholder.png"
            alt="placeholder"
            width={600}
            height={400}
            className="rounded-xl object-cover w-full h-64 md:h-80"
          />
        )}
      </div>

      {/* Vehicle Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-2">
          <p className="text-lg"><strong>Price:</strong> €{vehicle.price}</p>
          <p className="text-lg"><strong>Year:</strong> {vehicle.year}</p>
          <p className="text-lg"><strong>Kilometers:</strong> {vehicle.kilometers} km</p>
          <p className="text-lg"><strong>Fuel:</strong> {vehicle.fuel}</p>
          <p className="text-lg"><strong>Gearbox:</strong> {vehicle.gearbox}</p>
          {vehicle.doors && <p className="text-lg"><strong>Doors:</strong> {vehicle.doors}</p>}
          {vehicle.seats && <p className="text-lg"><strong>Seats:</strong> {vehicle.seats}</p>}
          {vehicle.color && <p className="text-lg"><strong>Color:</strong> {vehicle.color}</p>}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {vehicle.description && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-700">{vehicle.description}</p>
            </div>
          )}

          <div>
            <h2 className="text-xl font-semibold mb-2">Seller</h2>
            <Link
              href={`/user/${vehicle.user._id}`}
              className="text-blue-600 hover:underline font-medium"
            >
              {vehicle.user.name}
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
