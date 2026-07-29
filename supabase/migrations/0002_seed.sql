-- ============================================================
-- Demo seed data (safe to delete once you add real properties)
-- ============================================================

insert into properties (name, slug, description, address, city, country, cover_image_url, amenities, star_rating)
values
  (
    'Azure Cliffside Resort',
    'azure-cliffside-resort',
    'A cliffside escape overlooking the Mediterranean, with infinity pools and terraced gardens.',
    '12 Coastal Road',
    'Santorini',
    'Greece',
    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200',
    array['Infinity Pool', 'Spa', 'Free WiFi', 'Ocean View', 'Breakfast Included'],
    4.8
  ),
  (
    'Palm Grove Beach Hotel',
    'palm-grove-beach-hotel',
    'Beachfront hotel with private cabanas, a swim-up bar, and direct sand access.',
    '88 Shoreline Ave',
    'Bali',
    'Indonesia',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200',
    array['Private Beach', 'Pool Bar', 'Free WiFi', 'Spa', 'Airport Shuttle'],
    4.5
  ),
  (
    'Alpine Summit Lodge',
    'alpine-summit-lodge',
    'A timber-and-stone mountain lodge with ski-in/ski-out access and a wood-fired sauna.',
    '4 Ridge Trail',
    'Aspen',
    'USA',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200',
    array['Ski Access', 'Sauna', 'Fireplace', 'Free WiFi', 'Restaurant'],
    4.7
  );

-- Room types for Azure Cliffside Resort
insert into room_types (property_id, name, description, max_occupancy, base_price_cents, total_rooms, images, amenities)
select id, 'Deluxe Sea View', 'Spacious room with a private balcony facing the caldera.', 2, 32000, 8,
  array['https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800'],
  array['Balcony', 'King Bed', 'Minibar', 'Free WiFi']
from properties where slug = 'azure-cliffside-resort';

insert into room_types (property_id, name, description, max_occupancy, base_price_cents, total_rooms, images, amenities)
select id, 'Honeymoon Suite with Plunge Pool', 'Private plunge pool and uninterrupted sunset views.', 2, 58000, 3,
  array['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'],
  array['Private Pool', 'King Bed', 'Sunset View', 'Free WiFi']
from properties where slug = 'azure-cliffside-resort';

-- Room types for Palm Grove Beach Hotel
insert into room_types (property_id, name, description, max_occupancy, base_price_cents, total_rooms, images, amenities)
select id, 'Garden Bungalow', 'Standalone bungalow surrounded by tropical gardens.', 3, 21000, 10,
  array['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'],
  array['Garden View', 'Queen Bed', 'Free WiFi']
from properties where slug = 'palm-grove-beach-hotel';

insert into room_types (property_id, name, description, max_occupancy, base_price_cents, total_rooms, images, amenities)
select id, 'Beachfront Villa', 'Steps from the sand, with an outdoor rain shower.', 4, 41000, 5,
  array['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800'],
  array['Beachfront', 'Outdoor Shower', 'Free WiFi']
from properties where slug = 'palm-grove-beach-hotel';

-- Room types for Alpine Summit Lodge
insert into room_types (property_id, name, description, max_occupancy, base_price_cents, total_rooms, images, amenities)
select id, 'Timber Cabin Room', 'Cozy room with exposed timber beams and a stone fireplace.', 2, 27000, 12,
  array['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'],
  array['Fireplace', 'Mountain View', 'Free WiFi']
from properties where slug = 'alpine-summit-lodge';
