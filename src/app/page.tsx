import { createClient } from "@/lib/supabase/server";
import PropertyCard from "@/components/property-card";
import type { Property } from "@/types/database";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: properties, error } = await supabase
    .from("properties")
    .select("*")
    .order("name");

  return (
    <div>
      {/* Hero */}
      <section className="bg-ink text-sand">
        <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <p className="text-brass-soft text-sm tracking-[0.2em] uppercase mb-4">
            Handpicked stays, worldwide
          </p>
          <h1 className="font-display text-4xl sm:text-6xl leading-[1.05] max-w-2xl">
            Find the room with the view you&apos;ve been picturing.
          </h1>
          <p className="mt-6 text-sand/70 max-w-lg text-lg">
            Coastal cliffs, mountain ridgelines, and beachfront gardens — book direct,
            no middleman markups.
          </p>
        </div>
      </section>

      <div className="horizon-rule" />

      {/* Listings */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-display text-2xl text-ink mb-8">Our properties</h2>

        {error && (
          <p className="text-coral text-sm">
            Couldn&apos;t load properties. Make sure your Supabase environment
            variables are set and migrations have run.
          </p>
        )}

        {!error && (!properties || properties.length === 0) && (
          <p className="text-ink/60 text-sm">
            No properties yet. Run the seed migration to add demo data.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {properties?.map((property: Property, i: number) => (
            <PropertyCard key={property.id} property={property} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
