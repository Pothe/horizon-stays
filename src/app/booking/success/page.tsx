import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const methodLabel: Record<string, string> = {
  cash: "cash",
  bank_qr: "bank QR scan",
};

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ booking_id?: string }>;
}) {
  const { booking_id } = await searchParams;
  const supabase = await createClient();

  const { data: booking } = booking_id
    ? await supabase
        .from("bookings")
        .select("*, properties(name), room_types(name)")
        .eq("id", booking_id)
        .single()
    : { data: null };

  const propertyName = (booking as unknown as { properties?: { name: string } } | null)
    ?.properties?.name;
  const paymentMethod = (booking as unknown as { payment_method?: string } | null)
    ?.payment_method;

  const paymentPhrase = paymentMethod
    ? `by ${methodLabel[paymentMethod] ?? paymentMethod}`
    : "in person";

  return (
    <div className="mx-auto max-w-lg px-6 py-24 text-center">
      <p className="text-brass text-sm tracking-[0.2em] uppercase mb-4">Reservation confirmed</p>
      <h1 className="font-display text-3xl text-ink mb-4">You&apos;re all set.</h1>
      <p className="text-ink/60 mb-8">
        {propertyName
          ? `Your stay at ${propertyName} is confirmed. No payment is required now — you'll pay ${paymentPhrase} when you check in.`
          : `Your reservation is confirmed. No payment is required now — you'll pay ${paymentPhrase} when you check in.`}
      </p>
      <Link
        href="/bookings"
        className="inline-block bg-ink text-sand px-6 py-3 rounded-sm hover:bg-ink-soft transition-colors"
      >
        View my bookings
      </Link>
    </div>
  );
}
