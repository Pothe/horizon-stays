-- ============================================================
-- Hotel & Resort Booking App — Initial Schema
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------
-- PROPERTIES (hotels/resorts) — supports multi-property
-- ------------------------------------------------------------
create table properties (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text,
  address text,
  city text,
  country text,
  latitude double precision,
  longitude double precision,
  cover_image_url text,
  amenities text[] default '{}',
  star_rating numeric(2,1) check (star_rating between 0 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- ROOM TYPES — a category of room within a property
-- ------------------------------------------------------------
create table room_types (
  id uuid primary key default uuid_generate_v4(),
  property_id uuid not null references properties(id) on delete cascade,
  name text not null,
  description text,
  max_occupancy int not null default 2,
  base_price_cents int not null,
  currency text not null default 'USD',
  total_rooms int not null default 1,
  images text[] default '{}',
  amenities text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- PROFILES — extends Supabase auth.users
-- ------------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- BOOKINGS
-- ------------------------------------------------------------
create table bookings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  property_id uuid not null references properties(id),
  room_type_id uuid not null references room_types(id),
  check_in date not null,
  check_out date not null,
  guests int not null default 1,
  total_price_cents int not null,
  currency text not null default 'USD',
  status text not null default 'confirmed' check (status in ('pending','confirmed','cancelled','completed')),
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid','paid')),
  payment_method text check (payment_method in ('cash','bank_qr')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint valid_dates check (check_out > check_in)
);

create index idx_bookings_user on bookings(user_id);
create index idx_bookings_room_type on bookings(room_type_id);
create index idx_bookings_dates on bookings(check_in, check_out);

-- ------------------------------------------------------------
-- REVIEWS
-- ------------------------------------------------------------
create table reviews (
  id uuid primary key default uuid_generate_v4(),
  property_id uuid not null references properties(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  booking_id uuid references bookings(id) on delete set null,
  rating int not null check (rating between 1 and 5),
  title text,
  body text,
  created_at timestamptz not null default now(),
  unique (booking_id)
);

create index idx_reviews_property on reviews(property_id);

-- ------------------------------------------------------------
-- ROOM AVAILABILITY HELPER VIEW
-- Counts booked rooms of a given type overlapping a date range
-- ------------------------------------------------------------
create or replace function rooms_booked_count(
  p_room_type_id uuid,
  p_check_in date,
  p_check_out date
) returns int as $$
  select coalesce(sum(1), 0)::int
  from bookings
  where room_type_id = p_room_type_id
    and status in ('confirmed', 'completed')
    and check_in < p_check_out
    and check_out > p_check_in;
$$ language sql stable set search_path = public, pg_temp;

-- ------------------------------------------------------------
-- updated_at triggers
-- ------------------------------------------------------------
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql set search_path = public, pg_temp;

create trigger trg_properties_updated_at before update on properties
  for each row execute function set_updated_at();
create trigger trg_room_types_updated_at before update on room_types
  for each row execute function set_updated_at();
create trigger trg_bookings_updated_at before update on bookings
  for each row execute function set_updated_at();

-- ------------------------------------------------------------
-- Auto-create profile on signup
-- ------------------------------------------------------------
create or replace function handle_new_user() returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer set search_path = public, pg_temp;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Trigger function only — never callable directly via the REST API.
revoke execute on function public.handle_new_user() from anon, authenticated;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table properties enable row level security;
alter table room_types enable row level security;
alter table profiles enable row level security;
alter table bookings enable row level security;
alter table reviews enable row level security;

-- Properties & room types: public read
create policy "Properties are viewable by everyone"
  on properties for select using (true);

create policy "Room types are viewable by everyone"
  on room_types for select using (true);

-- Profiles: users manage their own
create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- Bookings: users manage their own
create policy "Users can view own bookings"
  on bookings for select using (auth.uid() = user_id);
create policy "Users can create own bookings"
  on bookings for insert with check (auth.uid() = user_id);
create policy "Users can update own bookings"
  on bookings for update using (auth.uid() = user_id);

-- Reviews: public read, owners write
create policy "Reviews are viewable by everyone"
  on reviews for select using (true);
create policy "Users can create reviews for own bookings"
  on reviews for insert with check (auth.uid() = user_id);
create policy "Users can update own reviews"
  on reviews for update using (auth.uid() = user_id);
