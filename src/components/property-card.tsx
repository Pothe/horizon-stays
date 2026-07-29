import Link from "next/link";
import Image from "next/image";
import type { Property } from "@/types/database";

export default function PropertyCard({ property, index }: { property: Property; index: number }) {
  return (
    <Link
      href={`/properties/${property.slug}`}
      className="group fade-up block"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-sand-deep">
        {property.cover_image_url && (
          <Image
            src={property.cover_image_url}
            alt={property.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(min-width: 768px) 33vw, 100vw"
          />
        )}
        {property.star_rating && (
          <span className="absolute top-3 left-3 bg-ink/80 text-sand text-xs px-2 py-1 rounded-sm tracking-wide">
            {property.star_rating.toFixed(1)} ★
          </span>
        )}
      </div>
      <div className="mt-4">
        <h3 className="font-display text-xl text-ink group-hover:text-brass transition-colors">
          {property.name}
        </h3>
        <p className="text-sm text-ink/60 mt-1">
          {property.city}, {property.country}
        </p>
      </div>
    </Link>
  );
}
