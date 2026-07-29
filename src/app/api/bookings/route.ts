import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { propertyId, roomTypeId, checkIn, checkOut, guests, paymentMethod } = body as {
    propertyId: string;
    roomTypeId: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    paymentMethod?: string;
  };

  if (!propertyId || !roomTypeId || !checkIn || !checkOut || !guests) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  if (paymentMethod && !["cash", "bank_qr"].includes(paymentMethod)) {
    return NextResponse.json({ error: "Invalid payment method." }, { status: 400 });
  }

  const resolvedPaymentMethod: "cash" | "bank_qr" =
    paymentMethod === "bank_qr" ? "bank_qr" : "cash";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Please sign in to book." }, { status: 401 });
  }

  const { data: roomType, error: roomTypeError } = await supabase
    .from("room_types")
    .select("*")
    .eq("id", roomTypeId)
    .single();

  if (roomTypeError || !roomType) {
    return NextResponse.json({ error: "Room type not found." }, { status: 404 });
  }

  // Check availability
  const { data: bookedCount, error: availabilityError } = await supabase.rpc(
    "rooms_booked_count",
    { p_room_type_id: roomTypeId, p_check_in: checkIn, p_check_out: checkOut }
  );

  if (availabilityError) {
    return NextResponse.json({ error: "Could not check availability." }, { status: 500 });
  }

  if ((bookedCount ?? 0) >= roomType.total_rooms) {
    return NextResponse.json(
      { error: "No rooms of this type are available for the selected dates." },
      { status: 409 }
    );
  }

  const nights = Math.round(
    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
  );

  if (nights <= 0) {
    return NextResponse.json({ error: "Invalid date range." }, { status: 400 });
  }

  const totalPriceCents = nights * roomType.base_price_cents;

  // Reservation is confirmed immediately — guest pays in person at check-in.
  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .insert({
      user_id: user.id,
      property_id: propertyId,
      room_type_id: roomTypeId,
      check_in: checkIn,
      check_out: checkOut,
      guests,
      total_price_cents: totalPriceCents,
      currency: roomType.currency,
      status: "confirmed",
      payment_status: "unpaid",
      payment_method: resolvedPaymentMethod,
    })
    .select()
    .single();

  if (bookingError || !booking) {
    return NextResponse.json({ error: "Could not create booking." }, { status: 500 });
  }

  return NextResponse.json({ bookingId: booking.id });
}
