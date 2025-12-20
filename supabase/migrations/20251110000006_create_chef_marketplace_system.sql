-- ============================================
-- CHEF & MARKETPLACE SYSTEM
-- Ev yemekleri sipariş platformu
-- ============================================

-- Drop old chef_profiles table if exists (from previous migrations)
DROP TABLE IF EXISTS chef_profiles CASCADE;

-- Chef profiles (extends profiles table)
CREATE TABLE chef_profiles (
    id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Verification
    is_verified BOOLEAN DEFAULT false,
    verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
    verification_date TIMESTAMPTZ,
    verified_by UUID REFERENCES profiles(id),
    
    -- Chef Details
    specialty TEXT[], -- ['Türk Mutfağı', 'Tatlılar', 'Hamur İşleri']
    bio TEXT,
    experience_years INTEGER,
    certificates TEXT[], -- ['Hijyen Belgesi', 'Aşçılık Sertifikası']
    
    -- Business Info
    business_name TEXT,
    business_hours JSONB, -- {"monday": {"open": "09:00", "close": "20:00"}, ...}
    average_prep_time INTEGER, -- ortalama hazırlık süresi (dakika)
    minimum_order_amount DECIMAL(10,2) DEFAULT 0,
    
    -- Location
    address TEXT,
    city TEXT,
    district TEXT,
    postal_code TEXT,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    service_radius INTEGER DEFAULT 5, -- km
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_accepting_orders BOOLEAN DEFAULT true,
    
    -- Stats
    total_orders INTEGER DEFAULT 0,
    completed_orders INTEGER DEFAULT 0,
    cancelled_orders INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    response_rate DECIMAL(5,2) DEFAULT 100, -- %
    average_response_time INTEGER, -- dakika
    
    -- Badges
    badges TEXT[], -- ['Top Rated', 'Fast Delivery', 'Premium Chef']
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Menu items (chef's products)
CREATE TABLE menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chef_id UUID NOT NULL REFERENCES chef_profiles(id) ON DELETE CASCADE,
    
    -- Basic Info
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL, -- 'Ana Yemek', 'Çorba', 'Tatlı', 'Hamur İşi', 'Salata'
    
    -- Pricing
    price DECIMAL(10,2) NOT NULL,
    discount_price DECIMAL(10,2),
    
    -- Images
    image_url TEXT,
    gallery JSONB, -- [{"url": "...", "alt": "..."}]
    
    -- Details
    portion_size TEXT, -- '1 kişilik', '2 kişilik', '4 kişilik'
    ingredients TEXT[],
    allergens TEXT[],
    tags TEXT[], -- ['vegan', 'glutensiz', 'diyet', 'baharatlı']
    
    -- Preparation
    prep_time INTEGER NOT NULL, -- dakika
    
    -- Delivery Options
    delivery_type TEXT NOT NULL CHECK (delivery_type IN ('instant', 'scheduled', 'both')),
    -- instant: Hızlı teslimat, scheduled: Randevulu, both: Her ikisi
    
    instant_delivery_available BOOLEAN DEFAULT false,
    scheduled_delivery_available BOOLEAN DEFAULT false,
    min_notice_hours INTEGER DEFAULT 2, -- randevulu için minimum önceden haber süresi
    
    -- Stock
    is_available BOOLEAN DEFAULT true,
    daily_stock INTEGER, -- günlük maksimum üretim
    current_stock INTEGER, -- bugün kalan stok
    
    -- Stats
    orders_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    favorites_count INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0,
    reviews_count INTEGER DEFAULT 0,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Drop old orders table if exists (from previous migrations)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;

-- Orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL, -- ORD-20250110-0001
    
    -- Parties
    customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    chef_id UUID NOT NULL REFERENCES chef_profiles(id) ON DELETE CASCADE,
    
    -- Order Type
    order_type TEXT NOT NULL CHECK (order_type IN ('instant', 'scheduled')),
    
    -- Scheduled Orders
    scheduled_date DATE,
    scheduled_time TIME,
    
    -- Delivery Info
    delivery_address TEXT NOT NULL,
    delivery_latitude DECIMAL(10,8),
    delivery_longitude DECIMAL(11,8),
    delivery_notes TEXT,
    delivery_distance DECIMAL(6,2), -- km
    
    -- Contact
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    
    -- Pricing
    subtotal DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(10,2) DEFAULT 0,
    service_fee DECIMAL(10,2) DEFAULT 0,
    discount DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    
    -- Payment
    payment_method TEXT DEFAULT 'cash' CHECK (payment_method IN ('cash', 'card', 'online')),
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
    
    -- Status
    status TEXT DEFAULT 'pending' CHECK (status IN (
        'pending',      -- Bekliyor (müşteri oluşturdu)
        'confirmed',    -- Onaylandı (şef kabul etti)
        'preparing',    -- Hazırlanıyor
        'ready',        -- Hazır (teslim alınabilir)
        'delivering',   -- Yolda
        'completed',    -- Tamamlandı
        'cancelled',    -- İptal edildi
        'rejected'      -- Reddedildi (şef tarafından)
    )),
    
    -- Tracking
    confirmed_at TIMESTAMPTZ,
    preparing_at TIMESTAMPTZ,
    ready_at TIMESTAMPTZ,
    delivering_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    
    -- Cancellation
    cancellation_reason TEXT,
    cancelled_by UUID REFERENCES profiles(id),
    
    -- Rating & Review
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    review_images JSONB,
    reviewed_at TIMESTAMPTZ,
    
    -- Chef Response
    chef_response TEXT,
    chef_response_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order items
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id UUID NOT NULL REFERENCES menu_items(id),
    
    -- Snapshot (at time of order)
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    
    -- Special requests
    notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chef badges (achievements for chefs)
CREATE TABLE chef_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT NOT NULL, -- emoji or icon name
    color TEXT DEFAULT '#F59E0B',
    
    -- Requirements
    requirement_type TEXT NOT NULL CHECK (requirement_type IN (
        'orders_completed',  -- X sipariş tamamla
        'rating_average',    -- X+ ortalama puan
        'response_time',     -- X dakika altında yanıt
        'specialty',         -- Belirli kategoride uzman
        'premium'            -- Premium üyelik
    )),
    requirement_value JSONB NOT NULL, -- {"min": 100} or {"category": "Tatlılar", "min": 50}
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chef badge awards
CREATE TABLE chef_badge_awards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chef_id UUID NOT NULL REFERENCES chef_profiles(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES chef_badges(id) ON DELETE CASCADE,
    
    awarded_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(chef_id, badge_id)
);

-- Menu item favorites
CREATE TABLE menu_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, menu_item_id)
);

-- Chef reviews (separate from order reviews)
CREATE TABLE chef_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chef_id UUID NOT NULL REFERENCES chef_profiles(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    review_images JSONB,
    
    -- Rating categories
    food_quality INTEGER CHECK (food_quality >= 1 AND food_quality <= 5),
    delivery_speed INTEGER CHECK (delivery_speed >= 1 AND delivery_speed <= 5),
    communication INTEGER CHECK (communication >= 1 AND communication <= 5),
    
    is_verified BOOLEAN DEFAULT false, -- verified purchase
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

-- Add missing columns if they don't exist (for compatibility with older chef_profiles table)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'chef_profiles' AND column_name = 'district'
    ) THEN
        ALTER TABLE chef_profiles ADD COLUMN district TEXT;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'chef_profiles' AND column_name = 'is_verified'
    ) THEN
        ALTER TABLE chef_profiles ADD COLUMN is_verified BOOLEAN DEFAULT false;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'chef_profiles' AND column_name = 'average_rating'
    ) THEN
        ALTER TABLE chef_profiles ADD COLUMN average_rating DECIMAL(3,2) DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'chef_profiles' AND column_name = 'verification_status'
    ) THEN
        ALTER TABLE chef_profiles ADD COLUMN verification_status TEXT DEFAULT 'pending';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'chef_profiles' AND column_name = 'verification_date'
    ) THEN
        ALTER TABLE chef_profiles ADD COLUMN verification_date TIMESTAMPTZ;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'chef_profiles' AND column_name = 'verified_by'
    ) THEN
        ALTER TABLE chef_profiles ADD COLUMN verified_by UUID REFERENCES profiles(id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'chef_profiles' AND column_name = 'specialty'
    ) THEN
        ALTER TABLE chef_profiles ADD COLUMN specialty TEXT[];
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'chef_profiles' AND column_name = 'bio'
    ) THEN
        ALTER TABLE chef_profiles ADD COLUMN bio TEXT;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'chef_profiles' AND column_name = 'experience_years'
    ) THEN
        ALTER TABLE chef_profiles ADD COLUMN experience_years INTEGER;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'chef_profiles' AND column_name = 'certificates'
    ) THEN
        ALTER TABLE chef_profiles ADD COLUMN certificates TEXT[];
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'chef_profiles' AND column_name = 'business_hours'
    ) THEN
        ALTER TABLE chef_profiles ADD COLUMN business_hours JSONB;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'chef_profiles' AND column_name = 'is_accepting_orders'
    ) THEN
        ALTER TABLE chef_profiles ADD COLUMN is_accepting_orders BOOLEAN DEFAULT true;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'chef_profiles' AND column_name = 'average_prep_time'
    ) THEN
        ALTER TABLE chef_profiles ADD COLUMN average_prep_time INTEGER;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'chef_profiles' AND column_name = 'minimum_order_amount'
    ) THEN
        ALTER TABLE chef_profiles ADD COLUMN minimum_order_amount DECIMAL(10,2) DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'chef_profiles' AND column_name = 'service_radius'
    ) THEN
        ALTER TABLE chef_profiles ADD COLUMN service_radius INTEGER DEFAULT 5;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'chef_profiles' AND column_name = 'badges'
    ) THEN
        ALTER TABLE chef_profiles ADD COLUMN badges TEXT[];
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'chef_profiles' AND column_name = 'total_orders'
    ) THEN
        ALTER TABLE chef_profiles ADD COLUMN total_orders INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'chef_profiles' AND column_name = 'completed_orders'
    ) THEN
        ALTER TABLE chef_profiles ADD COLUMN completed_orders INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'chef_profiles' AND column_name = 'cancelled_orders'
    ) THEN
        ALTER TABLE chef_profiles ADD COLUMN cancelled_orders INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'chef_profiles' AND column_name = 'total_reviews'
    ) THEN
        ALTER TABLE chef_profiles ADD COLUMN total_reviews INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'chef_profiles' AND column_name = 'response_rate'
    ) THEN
        ALTER TABLE chef_profiles ADD COLUMN response_rate DECIMAL(5,2) DEFAULT 100;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'chef_profiles' AND column_name = 'average_response_time'
    ) THEN
        ALTER TABLE chef_profiles ADD COLUMN average_response_time INTEGER;
    END IF;
END $$;

-- Add missing columns to orders table if they don't exist (for compatibility with older orders table)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'scheduled_date'
    ) THEN
        ALTER TABLE orders ADD COLUMN scheduled_date DATE;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'scheduled_time'
    ) THEN
        ALTER TABLE orders ADD COLUMN scheduled_time TIME;
    END IF;
END $$;

-- Add missing columns to order_items table if they don't exist (for compatibility with older order_items table)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'order_items' AND column_name = 'menu_item_id'
    ) THEN
        -- Add menu_item_id as alias for meal_id if it doesn't exist
        ALTER TABLE order_items ADD COLUMN menu_item_id UUID;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_chef_profiles_location ON chef_profiles(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_chef_profiles_city ON chef_profiles(city, district);
CREATE INDEX IF NOT EXISTS idx_chef_profiles_verified ON chef_profiles(is_verified, is_active);
CREATE INDEX IF NOT EXISTS idx_chef_profiles_rating ON chef_profiles(average_rating DESC);

CREATE INDEX IF NOT EXISTS idx_menu_items_chef ON menu_items(chef_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(is_available, is_active);
CREATE INDEX IF NOT EXISTS idx_menu_items_delivery_type ON menu_items(delivery_type);
CREATE INDEX IF NOT EXISTS idx_menu_items_rating ON menu_items(average_rating DESC);

CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_chef ON orders(chef_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_scheduled ON orders(scheduled_date, scheduled_time);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_menu ON order_items(menu_item_id);

CREATE INDEX IF NOT EXISTS idx_chef_reviews_chef ON chef_reviews(chef_id);
CREATE INDEX IF NOT EXISTS idx_chef_reviews_rating ON chef_reviews(rating DESC);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Update chef stats when order status changes
CREATE OR REPLACE FUNCTION update_chef_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        UPDATE chef_profiles
        SET completed_orders = completed_orders + 1,
            total_orders = total_orders + 1
        WHERE id = NEW.chef_id;
    END IF;
    
    IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
        UPDATE chef_profiles
        SET cancelled_orders = cancelled_orders + 1
        WHERE id = NEW.chef_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_chef_stats ON orders;
CREATE TRIGGER trigger_update_chef_stats
    AFTER UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_chef_stats();

-- Update chef average rating
CREATE OR REPLACE FUNCTION update_chef_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE chef_profiles
    SET average_rating = (
        SELECT AVG(rating)::DECIMAL(3,2)
        FROM chef_reviews
        WHERE chef_id = NEW.chef_id
    ),
    total_reviews = (
        SELECT COUNT(*)
        FROM chef_reviews
        WHERE chef_id = NEW.chef_id
    )
    WHERE id = NEW.chef_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_chef_rating ON chef_reviews;
CREATE TRIGGER trigger_update_chef_rating
    AFTER INSERT OR UPDATE ON chef_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_chef_rating();

-- Update menu item stats
CREATE OR REPLACE FUNCTION update_menu_item_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update orders count
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        UPDATE menu_items
        SET orders_count = orders_count + (
            SELECT COALESCE(SUM(quantity), 0)
            FROM order_items
            WHERE menu_item_id = menu_items.id
            AND order_id = NEW.id
        )
        WHERE id IN (
            SELECT menu_item_id
            FROM order_items
            WHERE order_id = NEW.id
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_menu_item_stats ON orders;
CREATE TRIGGER trigger_update_menu_item_stats
    AFTER UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_menu_item_stats();

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_chef_profiles_updated_at ON chef_profiles;
CREATE TRIGGER trigger_chef_profiles_updated_at
    BEFORE UPDATE ON chef_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trigger_menu_items_updated_at ON menu_items;
CREATE TRIGGER trigger_menu_items_updated_at
    BEFORE UPDATE ON menu_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trigger_orders_updated_at ON orders;
CREATE TRIGGER trigger_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.order_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
                        LPAD(nextval('order_number_seq')::TEXT, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE IF NOT EXISTS order_number_seq;

DROP TRIGGER IF EXISTS trigger_generate_order_number ON orders;
CREATE TRIGGER trigger_generate_order_number
    BEFORE INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION generate_order_number();

-- ============================================
-- RLS POLICIES
-- ============================================

ALTER TABLE chef_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE chef_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE chef_badge_awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE chef_reviews ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for compatibility with older migrations)
DROP POLICY IF EXISTS "Chef profiles are viewable by everyone" ON chef_profiles;
DROP POLICY IF EXISTS "Chef profiles viewable by everyone" ON chef_profiles;
DROP POLICY IF EXISTS "Users can create own chef profile" ON chef_profiles;
DROP POLICY IF EXISTS "Chefs can insert own profile" ON chef_profiles;
DROP POLICY IF EXISTS "Chefs can update own profile" ON chef_profiles;
DROP POLICY IF EXISTS "Meals are viewable by everyone" ON meals;
DROP POLICY IF EXISTS "Chefs can manage own meals" ON meals;
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can create orders" ON orders;
DROP POLICY IF EXISTS "Chefs can update orders for their meals" ON orders;
DROP POLICY IF EXISTS "Order items viewable with order" ON order_items;

-- Chef Profiles Policies
CREATE POLICY "Chef profiles viewable by everyone"
    ON chef_profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can create own chef profile"
    ON chef_profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Chefs can update own profile"
    ON chef_profiles FOR UPDATE
    USING (auth.uid() = id);

-- Menu Items Policies
CREATE POLICY "Menu items viewable by everyone"
    ON menu_items FOR SELECT
    USING (is_active = true OR chef_id = auth.uid());

CREATE POLICY "Chefs can create own menu items"
    ON menu_items FOR INSERT
    WITH CHECK (chef_id = auth.uid());

CREATE POLICY "Chefs can update own menu items"
    ON menu_items FOR UPDATE
    USING (chef_id = auth.uid());

CREATE POLICY "Chefs can delete own menu items"
    ON menu_items FOR DELETE
    USING (chef_id = auth.uid());

-- Orders Policies
CREATE POLICY "Users can view own orders"
    ON orders FOR SELECT
    USING (customer_id = auth.uid() OR chef_id = auth.uid());

CREATE POLICY "Customers can create orders"
    ON orders FOR INSERT
    WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Parties can update orders"
    ON orders FOR UPDATE
    USING (customer_id = auth.uid() OR chef_id = auth.uid());

-- Order Items Policies
CREATE POLICY "Users can view order items"
    ON order_items FOR SELECT
    USING (
        order_id IN (
            SELECT id FROM orders
            WHERE customer_id = auth.uid() OR chef_id = auth.uid()
        )
    );

CREATE POLICY "Customers can create order items"
    ON order_items FOR INSERT
    WITH CHECK (
        order_id IN (
            SELECT id FROM orders
            WHERE customer_id = auth.uid()
        )
    );

-- Chef Badges Policies
CREATE POLICY "Badges viewable by everyone"
    ON chef_badges FOR SELECT
    USING (true);

-- Badge Awards Policies
CREATE POLICY "Badge awards viewable by everyone"
    ON chef_badge_awards FOR SELECT
    USING (true);

-- Menu Favorites Policies
CREATE POLICY "Users can view own favorites"
    ON menu_favorites FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can create own favorites"
    ON menu_favorites FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own favorites"
    ON menu_favorites FOR DELETE
    USING (user_id = auth.uid());

-- Chef Reviews Policies
CREATE POLICY "Reviews viewable by everyone"
    ON chef_reviews FOR SELECT
    USING (true);

CREATE POLICY "Customers can create reviews"
    ON chef_reviews FOR INSERT
    WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Customers can update own reviews"
    ON chef_reviews FOR UPDATE
    USING (customer_id = auth.uid());
