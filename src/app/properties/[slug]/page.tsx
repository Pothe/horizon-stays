import { notFound } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import RoomTypeCard from "@/components/room-type-card";
import ReviewsList from "@/components/reviews-list";
import type { RoomType, Review } from "@/types/database";

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: property } = await supabase
    .from("properties")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!property) notFound();

  const { data: roomTypes } = await supabase
    .from("room_types")
    .select("*")
    .eq("property_id", property.id)
    .order("base_price_cents");

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("property_id", property.id)
    .order("created_at", { ascending: false });

  const avgRating =
    reviews && reviews.length > 0
      ? reviews.reduce((sum: number, r: Review) => sum + r.rating, 0) / reviews.length
      : property.star_rating;

  return (
    <div>
      <section className="relative h-[50vh] min-h-[360px] bg-ink">
        {property.cover_image_url && (
          <Image
            src={property.cover_image_url}
            alt={property.name}
            fill
            className="object-cover opacity-80"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-6xl px-6 pb-10 text-sand">
          <p className="text-brass-soft text-sm tracking-[0.2em] uppercase mb-2">
            {property.city}, {property.country}
          </p>
          <h1 className="font-display text-4xl sm:text-5xl">{property.name}</h1>
          {avgRating && (
            <p className="mt-2 text-sand/80 text-sm">
              {avgRating.toFixed(1)} ★ · {reviews?.length ?? 0} review
              {reviews?.length === 1 ? "" : "s"}
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <p className="text-ink/70 leading-relaxed">{property.description}</p>

          {property.amenities?.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {property.amenities.map((a: string) => (
                <span
                  key={a}
                  className="text-xs border border-ink/15 rounded-full px-3 py-1 text-ink/70"
                >
                  {a}
                </span>
              ))}
            </div>
          )}

          <div className="horizon-rule my-12" />

          <h2 className="font-display text-2xl mb-6">Rooms</h2>
          <div className="space-y-6">
            {roomTypes?.map((rt: RoomType) => (
              <RoomTypeCard key={rt.id} roomType={rt} propertyId={property.id} />
            ))}
            {(!roomTypes || roomTypes.length === 0) && (
              <p className="text-ink/60 text-sm">No room types listed yet.</p>
            )}
          </div>

          <div className="horizon-rule my-12" />

          <h2 className="font-display text-2xl mb-6">Guest reviews</h2>
          <ReviewsList reviews={reviews ?? []} />
        </div>
      </section>
    </div>
  );
}
