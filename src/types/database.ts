export type Property = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  cover_image_url: string | null;
  amenities: string[];
  star_rating: number | null;
  created_at: string;
  updated_at: string;
};

export type RoomType = {
  id: string;
  property_id: string;
  name: string;
  description: string | null;
  max_occupancy: number;
  base_price_cents: number;
  currency: string;
  total_rooms: number;
  images: string[];
  amenities: string[];
  created_at: string;
  updated_at: string;
};

export type Booking = {
  id: string;
  user_id: string;
  property_id: string;
  room_type_id: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_price_cents: number;
  currency: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  payment_status: "unpaid" | "paid";
  created_at: string;
  updated_at: string;
};

export type Review = {
  id: string;
  property_id: string;
  user_id: string;
  booking_id: string | null;
  rating: number;
  title: string | null;
  body: string | null;
  created_at: string;
};

export type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
};

// Minimal Database type for Supabase client generics.
// This is a hand-written approximation, good enough for editor autocomplete
// on straightforward queries. For full accuracy (joins, generated columns,
// enums), replace it with the output of:
//   npx supabase gen types typescript --project-id <your-project-ref>
type TableDef<Row> = {
  Row: Row;
  Insert: Partial<Row>;
  Update: Partial<Row>;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      properties: TableDef<Property>;
      room_types: TableDef<RoomType>;
      bookings: TableDef<Booking>;
      reviews: TableDef<Review>;
      profiles: TableDef<Profile>;
    };
    Views: Record<string, never>;
    Functions: {
      rooms_booked_count: {
        Args: { p_room_type_id: string; p_check_in: string; p_check_out: string };
        Returns: number;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
