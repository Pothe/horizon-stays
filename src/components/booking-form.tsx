"use client";

import { useState } from "react";
import type { RoomType } from "@/types/database";
import { createClient } from "@/lib/supabase/client";

export default function BookingForm({
  roomType,
  propertyId,
}: {
  roomType: RoomType;
  propertyId: string;
}) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nights =
    checkIn && checkOut
      ? Math.max(
          0,
          Math.round(
            (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0;
  const total = nights * roomType.base_price_cents;

  async function handleBook() {
    setError(null);

    if (!checkIn || !checkOut || nights <= 0) {
      setError("Choose a valid check-in and check-out date.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
        return;
      }

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId,
          roomTypeId: roomType.id,
          checkIn,
          checkOut,
          guests,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      window.location.href = `/booking/success?booking_id=${data.bookingId}`;
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-ink/60">Check-in</span>
        <input
          type="date"
          value={checkIn}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => setCheckIn(e.target.value)}
          className="border border-ink/20 rounded-sm px-3 py-2 bg-white"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-ink/60">Check-out</span>
        <input
          type="date"
          value={checkOut}
          min={checkIn || new Date().toISOString().split("T")[0]}
          onChange={(e) => setCheckOut(e.target.value)}
          className="border border-ink/20 rounded-sm px-3 py-2 bg-white"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-ink/60">Guests</span>
        <input
          type="number"
          min={1}
          max={roomType.max_occupancy}
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="border border-ink/20 rounded-sm px-3 py-2 bg-white"
        />
      </label>
      <div>
        <button
          onClick={handleBook}
          disabled={loading}
          className="w-full bg-brass text-ink font-medium px-4 py-2 rounded-sm hover:bg-brass-soft transition-colors disabled:opacity-50"
        >
          {loading ? "Reserving…" : "Reserve Now"}
        </button>
      </div>

      {nights > 0 && (
        <p className="sm:col-span-4 text-sm text-ink/60">
          {nights} night{nights === 1 ? "" : "s"} ·{" "}
          {(total / 100).toLocaleString(undefined, {
            style: "currency",
            currency: roomType.currency,
          })}{" "}
          total · <span className="text-ink/80">pay at check-in</span>
        </p>
      )}
      {error && <p className="sm:col-span-4 text-sm text-coral">{error}</p>}
    </div>
  );
}
