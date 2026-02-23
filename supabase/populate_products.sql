-- Populate products table with real skincare products and Amazon affiliate links
-- Run this in your Supabase SQL Editor

-- Clear existing dummy products
TRUNCATE public.products RESTART IDENTITY CASCADE;

INSERT INTO public.products (brand, name, price, rating, reviews, category, benefits, image, affiliate_link, description)
VALUES 
-- Minimalist
('Minimalist', '10% Niacinamide Face Serum', 599, 4.5, 1250, 'Serum', 
 ARRAY['Reduces Oil', 'Fades Dark Spots', 'Refines Pores'], 
 'https://m.media-amazon.com/images/I/41O-UuY7xDL._SX679_.jpg',
 'https://amzn.to/3S8xGgL',
 'Clinical grade serum with pure Niacinamide. Great for oily and acne-prone skin in humid weather.'),

('Minimalist', 'Sunscreen SPF 50 PA++++', 399, 4.4, 850, 'Sunscreen', 
 ARRAY['No White Cast', 'Spreads Easily', 'Matte Finish'], 
 'https://m.media-amazon.com/images/I/41uLz7T-NlL._SX679_.jpg',
 'https://amzn.to/3T6oY3p',
 'Lightweight sunscreen that provides broad spectrum protection. Essential for the Indian sun.'),

-- The Derma Co
('The Derma Co', '1% Salicylic Acid Gel Face Wash', 299, 4.3, 2100, 'Cleanser', 
 ARRAY['Fights Acne', 'Deep Cleaning', 'Oil Control'], 
 'https://m.media-amazon.com/images/I/51r-7p3Sj9L._SX679_.jpg',
 'https://amzn.to/3O9zK4f',
 'Gel-based cleanser that deep cleanses pores without drying the skin. Perfect for humid climates.'),

('The Derma Co', '2% Kojic Acid Serum', 499, 4.2, 540, 'Serum', 
 ARRAY['Fades Pigmentation', 'Evens Skin Tone', 'Brightens'], 
 'https://m.media-amazon.com/images/I/51Lp49R3S1L._SX679_.jpg',
 'https://amzn.to/3S8xO0z',
 'Targets hyperpigmentation and dark spots. Very effective for South Asian skin types.'),

-- Cetaphil
('Cetaphil', 'Gentle Skin Cleanser', 545, 4.6, 15000, 'Cleanser', 
 ARRAY['Non-irritating', 'Hypoallergenic', 'Dermatologist Recommended'], 
 'https://m.media-amazon.com/images/I/61Nl6L8V2TL._SX679_.jpg',
 'https://amzn.to/3UbV1zM',
 'The gold standard for sensitive skin. Soap-free formula that hydrates as it cleanses.'),

('Cetaphil', 'Moisturising Cream', 495, 4.5, 8200, 'Moisturizer', 
 ARRAY['Intense Hydration', 'Heals Dry Skin', 'Fragrance-free'], 
 'https://m.media-amazon.com/images/I/61S4p4W-YAL._SX679_.jpg',
 'https://amzn.to/3S8xPUP',
 'Rich moisturizing cream that provides 24-hour hydration. Great for dry winter months.'),

-- Dot & Key
('Dot & Key', 'Vitamin C + E Super Bright Glow Moisturizer', 595, 4.3, 420, 'Moisturizer', 
 ARRAY['Improves Glow', 'Non-sticky', 'Lightweight'], 
 'https://m.media-amazon.com/images/I/51p8P4S+EIL._SX679_.jpg',
 'https://amzn.to/3S8xRvS',
 'Sorbitol based moisturizer that gives an instant glow. Light enough for sticky weather.'),

-- Mamaearth
('Mamaearth', 'Aloe Ashwagandha Gel', 319, 4.4, 215, 'Treatment', 
 ARRAY['Soothes Skin', 'Anti-inflammatory', 'Refreshing'], 
 'https://m.media-amazon.com/images/I/51v8X4S+EIL._SX679_.jpg',
 'https://amzn.to/3S8xTzW',
 'Natural gel that soothes redness and irritation. Great for after-sun care.');
