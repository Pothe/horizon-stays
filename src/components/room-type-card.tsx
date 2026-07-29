"use client";

import { useState } from "react";
import Image from "next/image";
import type { RoomType } from "@/types/database";
import BookingForm from "@/components/booking-form";

export default function RoomTypeCard({
  roomType,
  propertyId,
}: {
  roomType: RoomType;
  propertyId: string;
}) {
  const [open, setOpen] = useState(false);
  const price = (roomType.base_price_cents / 100).toLocaleString(undefined, {
    style: "currency",
    currency: roomType.currency,
  });

  return (
    <div className="border border-ink/10 rounded-sm overflow-hidden bg-white/40">
      <div className="flex flex-col sm:flex-row">
        <div className="relative w-full sm:w-56 h-44 sm:h-auto shrink-0 bg-sand-deep">
          {roomType.images?.[0] && (
            <Image
              src={roomType.images[0]}
              alt={roomType.name}
              fill
              className="object-cover"
              sizes="224px"
            />
          )}
        </div>
        <div className="flex-1 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <h3 className="font-display text-lg text-ink">{roomType.name}</h3>
            <p className="text-sm text-ink/60 mt-1">{roomType.description}</p>
            <p className="text-xs text-ink/50 mt-2">
              Sleeps up to {roomType.max_occupancy} · {roomType.amenities?.join(" · ")}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="font-display text-xl text-ink">{price}</p>
            <p className="text-xs text-ink/50">per night</p>
            <button
              onClick={() => setOpen((v) => !v)}
              className="mt-3 text-sm bg-ink text-sand px-4 py-2 rounded-sm hover:bg-ink-soft transition-colors"
            >
              {open ? "Close" : "Book"}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="border-t border-ink/10 p-5 bg-sand/60">
          <BookingForm roomType={roomType} propertyId={propertyId} />
        </div>
      )}
    </div>
  );
}
