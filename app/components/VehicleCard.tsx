import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export type VehicleTypeCard = {
  _id: string;
  views: number;
  user: {
    _id: string;
    name: string;
  };
  brand: string;
  model: string;
  price: number;
  year: number;
  kilometers: number;
  fuel: string;
  gearbox: string;
  images?: { asset: { url: string } }[];
};

const VehicleCard = ({ post }: { post: VehicleTypeCard }) => {
  const {
    views,
    user: { _id: authorId, name },
    brand,
    model,
    price,
    year,
    kilometers,
    fuel,
    gearbox,
    images,
    _id,
  } = post;

  const mainImage = images && images.length > 0 ? images[0].asset.url : "/placeholder.png";

  return (
    <li className="vehicle-card border rounded-lg p-4 shadow-sm bg-white  transition-transform transform hover:scale-105">
      {/* Header: Views */}
      

      {/* Author + Title */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <Link href={`/user/${authorId}`}>
            <p className="font-medium text-gray-700 ">{name}</p>
          </Link>
          <Link href={`/vehicle/${_id}`}>
            <h3 className="text-lg font-semibold text-gray-900 ">
              {brand} {model}
            </h3>
          </Link>
        </div>
      </div>

      {/* Main Image */}
      <Link href={`/vehicle/${_id}`} className="block mb-2">
        <Image
          src={mainImage}
          alt={`${brand} ${model}`}
          width={400}
          height={250}
          className="w-full h-auto rounded-md object-cover"
        />
      </Link>

      {/* Specs */}
      <div className="text-sm text-gray-700  mb-2 grid grid-cols-2 gap-2">
        <p><strong>Price:</strong> €{price}</p>
        <p><strong>Year:</strong> {year}</p>
        <p><strong>Kilometers:</strong> {kilometers} km</p>
        <p><strong>Fuel:</strong> {fuel}</p>
        <p><strong>Gearbox:</strong> {gearbox}</p>
      </div>

      {/* Footer: Details Button */}
      <div className="flex justify-between text-sm text-gray-500 mb-2">
        <p>{views} views</p>
        <Button className="details-btn" asChild>
          <Link href={`/vehicle/${_id}`}>Details</Link>
        </Button>
      </div>
    </li>
  );
};

export default VehicleCard;
