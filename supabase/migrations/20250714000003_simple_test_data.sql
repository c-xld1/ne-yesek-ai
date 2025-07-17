-- Simple test data for database
-- Created: 2025-07-14

-- Insert a test user in auth.users first (simplified for local dev)
INSERT INTO auth.users (
    id, 
    email, 
    email_confirmed_at, 
    created_at, 
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    role
) VALUES (
    '11111111-1111-1111-1111-111111111111', 
    'test@example.com',
    NOW(), 
    NOW(), 
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{}',
    false,
    'authenticated'
) ON CONFLICT (id) DO NOTHING;

-- Create corresponding profile
INSERT INTO public.profiles (id, fullname, username, bio, created_at, updated_at) 
VALUES (
    '11111111-1111-1111-1111-111111111111', 
    'Test User', 
    'testuser', 
    'Test chef for development', 
    NOW(), 
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Insert a Turkish Manti recipe (get first category for ana-yemekler)
INSERT INTO public.recipes (
    id, 
    title, 
    slug, 
    description, 
    content, 
    instructions, 
    ingredients, 
    prep_time, 
    cooking_time, 
    servings, 
    difficulty, 
    image_url, 
    author_id, 
    category_id, 
    tags, 
    nutritional_info, 
    created_at, 
    updated_at
) VALUES (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 
    'Turkish Manti', 
    'turkish-manti', 
    'Traditional Turkish dumplings',
    'Turkish manti is a traditional dumpling dish that represents the heart of Turkish cuisine. These small, delicate dumplings are filled with spiced ground meat and served with garlic yogurt and melted butter sauce.',
    '["Mix dough", "Roll thin", "Add filling", "Boil", "Serve with yogurt"]',
    '["500g flour", "1 egg", "300g ground meat", "yogurt", "butter", "garlic"]',
    60, 
    30, 
    4, 
    'zor', 
    'https://images.unsplash.com/photo-1599921841143-819fcd4b8a0e?w=800',
    '11111111-1111-1111-1111-111111111111', 
    (SELECT id FROM public.categories WHERE slug = 'ana-yemekler' LIMIT 1), 
    '{turkish,traditional,manti,dumplings}',
    '{"calories": 450, "protein": 25, "carbs": 65, "fat": 12}',
    NOW(), 
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Insert a Quinoa Salad recipe
INSERT INTO public.recipes (
    id, 
    title, 
    slug, 
    description, 
    content, 
    instructions, 
    ingredients, 
    prep_time, 
    cooking_time, 
    servings, 
    difficulty, 
    image_url, 
    author_id, 
    category_id, 
    tags, 
    nutritional_info, 
    created_at, 
    updated_at
) VALUES (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 
    'Quinoa Salad', 
    'quinoa-salad', 
    'Healthy protein-rich quinoa salad',
    'This nutritious quinoa salad is packed with fresh vegetables, protein-rich quinoa, and a delicious lemon vinaigrette. Perfect for a healthy lunch or dinner.',
    '["Cook quinoa", "Chop vegetables", "Make dressing", "Mix all ingredients"]',
    '["1 cup quinoa", "1 cucumber", "2 tomatoes", "1 avocado", "arugula", "feta", "olive oil", "lemon"]',
    15, 
    15, 
    3, 
    'kolay', 
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
    '11111111-1111-1111-1111-111111111111', 
    (SELECT id FROM public.categories WHERE slug = 'salatalar' LIMIT 1), 
    '{healthy,quinoa,salad,protein,vegetarian}',
    '{"calories": 280, "protein": 12, "carbs": 30, "fat": 14}',
    NOW(), 
    NOW()
) ON CONFLICT (id) DO NOTHING;
