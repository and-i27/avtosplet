"use client";

import { useState } from "react";
import Image from "next/image";

type VehicleGalleryProps = {
  images: string[];
  alt: string;
};

export default function VehicleGallery({ images, alt }: VehicleGalleryProps) {
  const galleryImages = images.length > 0 ? images : ["/placeholder.png"];
  const [selectedImage, setSelectedImage] = useState(galleryImages[0]);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border bg-white">
        <Image
          src={selectedImage}
          alt={alt}
          width={1200}
          height={800}
          className="h-72 w-full object-cover md:h-[28rem]"
        />
      </div>

      {galleryImages.length > 1 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {galleryImages.map((image, index) => {
            const isActive = image === selectedImage;

            return (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setSelectedImage(image)}
                className={`overflow-hidden rounded-lg border transition ${
                  isActive ? "border-blue-600 ring-2 ring-blue-200" : "border-gray-200 hover:border-blue-400"
                }`}
              >
                <Image
                  src={image}
                  alt={`${alt} ${index + 1}`}
                  width={240}
                  height={160}
                  className="h-24 w-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
