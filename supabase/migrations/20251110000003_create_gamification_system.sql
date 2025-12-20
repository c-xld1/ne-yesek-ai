-- Create competitions and user points system for gamification

-- User points table
CREATE TABLE IF NOT EXISTS public.user_points (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    total_points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    level_progress INTEGER DEFAULT 0, -- Progress to next level (0-100)
    weekly_points INTEGER DEFAULT 0,
    monthly_points INTEGER DEFAULT 0,
    last_activity_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Point transactions history
CREATE TABLE IF NOT EXISTS public.point_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    points INTEGER NOT NULL,
    reason TEXT NOT NULL, -- 'recipe_added', 'comment_posted', 'recipe_liked', 'video_shared', etc.
    reference_id UUID, -- ID of related recipe, comment, etc.
    reference_type TEXT, -- 'recipe', 'comment', 'video', etc.
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Competitions table
CREATE TABLE IF NOT EXISTS public.competitions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    theme TEXT NOT NULL, -- 'breakfast', 'dessert', 'quick_meal', '3_ingredients', etc.
    rules JSONB DEFAULT '[]'::jsonb,
    prizes JSONB DEFAULT '[]'::jsonb, -- Array of prize descriptions
    banner_image TEXT,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    status TEXT DEFAULT 'upcoming', -- 'upcoming', 'active', 'judging', 'completed'
    max_participants INTEGER,
    entry_requirements JSONB DEFAULT '{}'::jsonb,
    judging_criteria JSONB DEFAULT '[]'::jsonb,
    winner_announced_at TIMESTAMPTZ,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CHECK (status IN ('upcoming', 'active', 'judging', 'completed'))
);

-- Competition entries
CREATE TABLE IF NOT EXISTS public.competition_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    competition_id UUID REFERENCES competitions(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,
    entry_description TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    vote_count INTEGER DEFAULT 0,
    jury_score DECIMAL(3,2), -- 0.00 to 10.00
    final_rank INTEGER,
    prize_won TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'winner'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(competition_id, recipe_id),
    CHECK (status IN ('pending', 'approved', 'rejected', 'winner'))
);

-- Competition votes (community voting)
CREATE TABLE IF NOT EXISTS public.competition_votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    entry_id UUID REFERENCES competition_entries(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(entry_id, user_id)
);

-- Leaderboards (cached for performance)
CREATE TABLE IF NOT EXISTS public.leaderboards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL, -- 'weekly', 'monthly', 'all_time'
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    username TEXT NOT NULL,
    avatar_url TEXT,
    points INTEGER NOT NULL,
    rank INTEGER NOT NULL,
    badge_count INTEGER DEFAULT 0,
    recipe_count INTEGER DEFAULT 0,
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(type, user_id)
);

-- Badges (special achievements)
CREATE TABLE IF NOT EXISTS public.badges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    category TEXT NOT NULL, -- 'specialty', 'competition', 'milestone', 'seasonal'
    rarity TEXT DEFAULT 'common', -- 'common', 'rare', 'epic', 'legendary'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User badges
CREATE TABLE IF NOT EXISTS public.user_badges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    badge_key TEXT NOT NULL,
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    display_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    UNIQUE(user_id, badge_key)
);

-- Indexes
CREATE INDEX idx_user_points_user_id ON user_points(user_id);
CREATE INDEX idx_user_points_total ON user_points(total_points DESC);
CREATE INDEX idx_user_points_weekly ON user_points(weekly_points DESC);
CREATE INDEX idx_user_points_level ON user_points(level DESC);

CREATE INDEX idx_point_transactions_user ON point_transactions(user_id);
CREATE INDEX idx_point_transactions_created ON point_transactions(created_at DESC);
CREATE INDEX idx_point_transactions_reason ON point_transactions(reason);

CREATE INDEX idx_competitions_status ON competitions(status);
CREATE INDEX idx_competitions_dates ON competitions(start_date, end_date);
CREATE INDEX idx_competitions_theme ON competitions(theme);

CREATE INDEX idx_competition_entries_competition ON competition_entries(competition_id);
CREATE INDEX idx_competition_entries_user ON competition_entries(user_id);
CREATE INDEX idx_competition_entries_votes ON competition_entries(vote_count DESC);
CREATE INDEX idx_competition_entries_rank ON competition_entries(final_rank);

CREATE INDEX idx_competition_votes_entry ON competition_votes(entry_id);
CREATE INDEX idx_competition_votes_user ON competition_votes(user_id);

CREATE INDEX idx_leaderboards_type_rank ON leaderboards(type, rank);
CREATE INDEX idx_leaderboards_updated ON leaderboards(last_updated DESC);

CREATE INDEX idx_badges_category ON badges(category);
CREATE INDEX idx_badges_rarity ON badges(rarity);

CREATE INDEX idx_user_badges_user ON user_badges(user_id);
CREATE INDEX idx_user_badges_display ON user_badges(user_id, display_order);

-- RLS Policies
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE competition_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE competition_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- User Points Policies
CREATE POLICY "User points are viewable by everyone"
    ON user_points FOR SELECT USING (true);

CREATE POLICY "Users can update own points"
    ON user_points FOR UPDATE
    USING (auth.uid() = user_id);

-- Point Transactions Policies
CREATE POLICY "Users can view own transactions"
    ON point_transactions FOR SELECT
    USING (auth.uid() = user_id);

-- Competitions Policies
CREATE POLICY "Competitions are viewable by everyone"
    ON competitions FOR SELECT USING (true);

CREATE POLICY "Admins can manage competitions"
    ON competitions FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Competition Entries Policies
CREATE POLICY "Entries are viewable by everyone"
    ON competition_entries FOR SELECT USING (true);

CREATE POLICY "Users can submit entries"
    ON competition_entries FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own entries"
    ON competition_entries FOR UPDATE
    USING (auth.uid() = user_id);

-- Competition Votes Policies
CREATE POLICY "Votes are viewable by everyone"
    ON competition_votes FOR SELECT USING (true);

CREATE POLICY "Users can vote"
    ON competition_votes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own votes"
    ON competition_votes FOR DELETE
    USING (auth.uid() = user_id);

-- Leaderboards Policies
CREATE POLICY "Leaderboards are viewable by everyone"
    ON leaderboards FOR SELECT USING (true);

-- Badges Policies
CREATE POLICY "Badges are viewable by everyone"
    ON badges FOR SELECT USING (is_active = true);

CREATE POLICY "User badges are viewable by everyone"
    ON user_badges FOR SELECT USING (true);

-- Functions

-- Award points to user
CREATE OR REPLACE FUNCTION award_points(
    p_user_id UUID,
    p_points INTEGER,
    p_reason TEXT,
    p_reference_id UUID DEFAULT NULL,
    p_reference_type TEXT DEFAULT NULL
)
RETURNS void AS $$
DECLARE
    v_new_total INTEGER;
    v_level INTEGER;
    v_points_for_next_level INTEGER;
BEGIN
    -- Insert transaction
    INSERT INTO point_transactions (user_id, points, reason, reference_id, reference_type)
    VALUES (p_user_id, p_points, p_reason, p_reference_id, p_reference_type);
    
    -- Update or create user points
    INSERT INTO user_points (user_id, total_points, weekly_points, monthly_points)
    VALUES (p_user_id, p_points, p_points, p_points)
    ON CONFLICT (user_id) DO UPDATE SET
        total_points = user_points.total_points + p_points,
        weekly_points = user_points.weekly_points + p_points,
        monthly_points = user_points.monthly_points + p_points,
        last_activity_at = NOW(),
        updated_at = NOW()
    RETURNING total_points INTO v_new_total;
    
    -- Calculate level (every 1000 points = 1 level)
    v_level := FLOOR(v_new_total / 1000) + 1;
    v_points_for_next_level := ((v_level) * 1000) - v_new_total;
    
    -- Update level
    UPDATE user_points
    SET 
        level = v_level,
        level_progress = LEAST(100, ((v_new_total % 1000) * 100 / 1000))
    WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Reset weekly/monthly points
CREATE OR REPLACE FUNCTION reset_periodic_points()
RETURNS void AS $$
BEGIN
    -- Reset weekly (runs on Monday)
    IF EXTRACT(DOW FROM NOW()) = 1 THEN
        UPDATE user_points SET weekly_points = 0;
    END IF;
    
    -- Reset monthly (runs on 1st)
    IF EXTRACT(DAY FROM NOW()) = 1 THEN
        UPDATE user_points SET monthly_points = 0;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update leaderboards
CREATE OR REPLACE FUNCTION update_leaderboards()
RETURNS void AS $$
BEGIN
    -- Weekly leaderboard
    DELETE FROM leaderboards WHERE type = 'weekly';
    INSERT INTO leaderboards (type, user_id, username, avatar_url, points, rank, badge_count, recipe_count)
    SELECT 
        'weekly',
        up.user_id,
        p.username,
        p.avatar_url,
        up.weekly_points,
        ROW_NUMBER() OVER (ORDER BY up.weekly_points DESC),
        (SELECT COUNT(*) FROM user_badges WHERE user_id = up.user_id),
        (SELECT COUNT(*) FROM recipes WHERE author_id = up.user_id)
    FROM user_points up
    JOIN profiles p ON p.id = up.user_id
    WHERE up.weekly_points > 0
    ORDER BY up.weekly_points DESC
    LIMIT 100;
    
    -- Monthly leaderboard
    DELETE FROM leaderboards WHERE type = 'monthly';
    INSERT INTO leaderboards (type, user_id, username, avatar_url, points, rank, badge_count, recipe_count)
    SELECT 
        'monthly',
        up.user_id,
        p.username,
        p.avatar_url,
        up.monthly_points,
        ROW_NUMBER() OVER (ORDER BY up.monthly_points DESC),
        (SELECT COUNT(*) FROM user_badges WHERE user_id = up.user_id),
        (SELECT COUNT(*) FROM recipes WHERE author_id = up.user_id)
    FROM user_points up
    JOIN profiles p ON p.id = up.user_id
    WHERE up.monthly_points > 0
    ORDER BY up.monthly_points DESC
    LIMIT 100;
    
    -- All-time leaderboard
    DELETE FROM leaderboards WHERE type = 'all_time';
    INSERT INTO leaderboards (type, user_id, username, avatar_url, points, rank, badge_count, recipe_count)
    SELECT 
        'all_time',
        up.user_id,
        p.username,
        p.avatar_url,
        up.total_points,
        ROW_NUMBER() OVER (ORDER BY up.total_points DESC),
        (SELECT COUNT(*) FROM user_badges WHERE user_id = up.user_id),
        (SELECT COUNT(*) FROM recipes WHERE author_id = up.user_id)
    FROM user_points up
    JOIN profiles p ON p.id = up.user_id
    WHERE up.total_points > 0
    ORDER BY up.total_points DESC
    LIMIT 100;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment competition entry votes
CREATE OR REPLACE FUNCTION increment_entry_votes()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE competition_entries
    SET vote_count = vote_count + 1
    WHERE id = NEW.entry_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_entry_votes()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE competition_entries
    SET vote_count = vote_count - 1
    WHERE id = OLD.entry_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Triggers
DROP TRIGGER IF EXISTS competition_vote_increment ON competition_votes;
CREATE TRIGGER competition_vote_increment
    AFTER INSERT ON competition_votes
    FOR EACH ROW
    EXECUTE FUNCTION increment_entry_votes();

DROP TRIGGER IF EXISTS competition_vote_decrement ON competition_votes;
CREATE TRIGGER competition_vote_decrement
    AFTER DELETE ON competition_votes
    FOR EACH ROW
    EXECUTE FUNCTION decrement_entry_votes();

-- Insert sample badges
INSERT INTO badges (key, title, description, icon, color, category, rarity) VALUES
    ('dessert_master', 'Tatlı Uzmanı', '50+ tatlı tarifi paylaştı', '🍰', 'bg-pink-500', 'specialty', 'rare'),
    ('quick_cook', 'Hızlı Tarif Şampiyonu', '30dk altı 25+ tarif', '⚡', 'bg-yellow-500', 'specialty', 'rare'),
    ('video_guru', 'Videolu Anlatım Gurusu', '20+ videolu tarif', '🎥', 'bg-purple-500', 'specialty', 'epic'),
    ('breakfast_king', 'Kahvaltı Kralı', 'Kahvaltı kategorisinde uzman', '🍳', 'bg-orange-500', 'specialty', 'rare'),
    ('competition_winner', 'Yarışma Kazananı', 'Bir yarışmada birinci oldu', '🏆', 'bg-gold-500', 'competition', 'legendary'),
    ('competition_finalist', 'Yarışma Finalistı', 'Bir yarışmada ilk 3e girdi', '🥈', 'bg-silver-500', 'competition', 'epic'),
    ('seasonal_chef', 'Mevsim Şefi', 'Mevsimlik yarışmada ödül aldı', '🌸', 'bg-green-500', 'seasonal', 'rare'),
    ('community_favorite', 'Toplumun Favorisi', 'En çok oy alan tarif', '💝', 'bg-red-500', 'milestone', 'epic')
ON CONFLICT (key) DO NOTHING;

-- Comments
COMMENT ON TABLE user_points IS 'User gamification points and levels';
COMMENT ON TABLE point_transactions IS 'History of all point awards and deductions';
COMMENT ON TABLE competitions IS 'Recipe competitions and challenges';
COMMENT ON TABLE competition_entries IS 'User entries to competitions';
COMMENT ON TABLE competition_votes IS 'Community votes for competition entries';
COMMENT ON TABLE leaderboards IS 'Cached leaderboard rankings';
COMMENT ON TABLE badges IS 'Special achievement badges';
COMMENT ON TABLE user_badges IS 'Badges earned by users';
