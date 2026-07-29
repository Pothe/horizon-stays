import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const statusStyles: Record<string, string> = {
  pending: "bg-brass-soft/40 text-brass",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  completed: "bg-ink/10 text-ink/70",
};

const paymentStyles: Record<string, string> = {
  unpaid: "bg-brass-soft/40 text-brass",
  paid: "bg-green-100 text-green-700",
};

const methodLabel: Record<string, string> = {
  cash: "Cash",
  bank_qr: "Bank QR",
};

export default async function BookingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/bookings");
  }

  const { data: bookings } = await supabase
    .from("bookings")
    .select("*, properties(name, slug, city, country), room_types(name)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-3xl text-ink mb-8">My bookings</h1>

      {(!bookings || bookings.length === 0) && (
        <p className="text-ink/60 text-sm">
          No bookings yet.{" "}
          <Link href="/" className="text-brass underline">
            Browse properties
          </Link>
          .
        </p>
      )}

      <div className="space-y-4">
        {bookings?.map((booking) => {
          const property = (booking as unknown as {
            properties: { name: string; slug: string; city: string; country: string };
          }).properties;
          const roomType = (booking as unknown as { room_types: { name: string } }).room_types;
          const total = (booking.total_price_cents / 100).toLocaleString(undefined, {
            style: "currency",
            currency: booking.currency,
          });

          return (
            <div
              key={booking.id}
              className="border border-ink/10 rounded-sm p-5 flex items-center justify-between gap-4 bg-white/40"
            >
              <div>
                <Link
                  href={`/properties/${property?.slug}`}
                  className="font-display text-lg text-ink hover:text-brass transition-colors"
                >
                  {property?.name}
                </Link>
                <p className="text-sm text-ink/60 mt-1">
                  {roomType?.name} · {booking.check_in} → {booking.check_out} ·{" "}
                  {booking.guests} guest{booking.guests === 1 ? "" : "s"} · {total}
                  {booking.payment_method && ` · ${methodLabel[booking.payment_method]}`}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <span
                  className={`text-xs px-3 py-1 rounded-full capitalize ${statusStyles[booking.status]}`}
                >
                  {booking.status}
                </span>
                <span
                  className={`text-xs px-3 py-1 rounded-full capitalize ${paymentStyles[booking.payment_status]}`}
                >
                  {booking.payment_status === "paid" ? "Paid" : "Pay at check-in"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
