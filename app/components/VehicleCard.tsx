import React from "react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const VehicleCard = ({ post }: { post: VehicleTypeCard }) => {
  const {
    _cratedAt,
    views,
    author: { _id: authorId, name },
    title,
    category,
    _id,
    image,
    description,
  } = post;

  return (
    <li className="vehicle-card">
      {/* Header: Date + Views */}
      <div className="card-header">
        <p className="card-date">{formatDate(_cratedAt)}</p>
        <div className="card-views">{views} views</div>
      </div>

      {/* Author + Title */}
      <div className="flex justify-between items-center">
        <div className="card-author">
          <Link href={`/user/${authorId}`}>
            <p className="author-name">{name}</p>
          </Link>
          <Link href={`/vehicle/${_id}`}>
            <h3 className="vehicle-title">{title}</h3>
          </Link>
        </div>
        <Link href={`/user/${authorId}`}>
          <Image
            src="https://placehold.co/48x48"
            alt={name}
            width={48}
            height={48}
            className="author-avatar"
          />
        </Link>
      </div>

      {/* Description + Image */}
      <Link href={`/vehicle/${_id}`}>
        <p className="card-description">{description}</p>
        <img src={image} alt={title} className="vehicle-image" />
      </Link>

      {/* Footer: Category + Details Button */}
      <div className="card-footer">
        <Link href={`/?query=${category.toLowerCase()}`} className="category-link">
          {category}
        </Link>
        <Button className="details-btn" asChild>
          <Link href={`/vehicle/${_id}`}>Details</Link>
        </Button>
      </div>
    </li>
  );
};

export default VehicleCard;
