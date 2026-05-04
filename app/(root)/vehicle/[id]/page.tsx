// vehicle details page

import { client } from "@/sanity/lib/client";
import { VEHICLE_BY_ID_QUERY } from "@/sanity/lib/queries";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import VehicleGallery from "@/app/components/VehicleGallery";
import VehicleContactForm from "@/app/components/VehicleContactForm";

// Vehicle type definition
type VehicleTypeDetail = {
  _id: string;
  brand?: { _id: string; name?: string };
  model?: { _id: string; name?: string };
  price: number;
  year: number;
  kilometers: number;
  fuel?: { _id: string; name?: string };
  gearbox?: { _id: string; name?: string };
  doors?: string;
  seats?: number;
  color?: { _id: string; name?: string };
  description?: string;
  images?: { asset: { url: string } }[];
  views: number;
  user: {
    _id: string;
    name: string;
  };
};

// vehicle page props type
type VehiclePageProps = {
  params: Promise<{ id: string }>;
};

export default async function VehicleDetailPage({ params }: VehiclePageProps) {
  // Extract vehicle ID from params
  const { id } = await params;

  // If no ID, show not found message
  if (!id) {
    return <p className="text-gray-500">Vozilo ni najdeno.</p>;
  }

  // Fetch vehicle details from Sanity
  const vehicle = await client.fetch<VehicleTypeDetail | null>(
    VEHICLE_BY_ID_QUERY,
    { id }
  );

  // If vehicle not found, show message
  if (!vehicle) {
    return <p className="text-gray-500">Vozilo ni najdeno.</p>;
  }

  const galleryImages = vehicle.images?.map((image) => image.asset.url) ?? [];
  const vehicleTitle = `${vehicle.brand?.name || "N/A"} ${vehicle.model?.name || "N/A"}`;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Title */}
      <h1 className="text-3xl font-bold">
        {vehicleTitle}
      </h1>

      <VehicleGallery images={galleryImages} alt={vehicleTitle} />

      {/* Vehicle Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-2">
          <p className="text-lg"><strong>Price:</strong> €{vehicle.price}</p>
          <p className="text-lg"><strong>Year:</strong> {vehicle.year}</p>
          <p className="text-lg"><strong>Kilometers:</strong> {vehicle.kilometers} km</p>
          <p className="text-lg"><strong>Fuel:</strong> {vehicle.fuel?.name || "N/A"}</p>
          <p className="text-lg"><strong>Gearbox:</strong> {vehicle.gearbox?.name || "N/A"}</p>
          {vehicle.doors && <p className="text-lg"><strong>Doors:</strong> {vehicle.doors}</p>}
          {vehicle.seats && <p className="text-lg"><strong>Seats:</strong> {vehicle.seats}</p>}
          {vehicle.color && <p className="text-lg"><strong>Color:</strong> {vehicle.color?.name || "N/A"}</p>}
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
            <p className="text-lg">
              <strong>Name:</strong> {vehicle.user.name}
            </p>
          </div>

          <VehicleContactForm
            vehicleId={vehicle._id}
            vehicleTitle={vehicleTitle}
            ownerId={vehicle.user._id}
          />
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex gap-4">
        <Button asChild>
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
          >
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
