-- Create qna_categories table
CREATE TABLE IF NOT EXISTS public.qna_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    color TEXT,
    icon TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create questions table
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    category_id UUID REFERENCES public.qna_categories(id) ON DELETE SET NULL,
    tags TEXT[] DEFAULT '{}',
    views INTEGER DEFAULT 0,
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    answers_count INTEGER DEFAULT 0,
    is_solved BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create answers table
CREATE TABLE IF NOT EXISTS public.answers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    content TEXT NOT NULL,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE NOT NULL,
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    is_accepted BOOLEAN DEFAULT FALSE,
    is_flagged BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.qna_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;

-- Create policies for qna_categories
CREATE POLICY "QnA categories are viewable by everyone" 
ON public.qna_categories FOR SELECT 
USING (is_active = true);

CREATE POLICY "Only authenticated users can create QnA categories" 
ON public.qna_categories FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Only authenticated users can update QnA categories" 
ON public.qna_categories FOR UPDATE 
TO authenticated 
USING (true);

-- Create policies for questions
CREATE POLICY "Questions are viewable by everyone" 
ON public.questions FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create questions" 
ON public.questions FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own questions" 
ON public.questions FOR UPDATE 
USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own questions" 
ON public.questions FOR DELETE 
USING (auth.uid() = author_id);

-- Create policies for answers
CREATE POLICY "Answers are viewable by everyone" 
ON public.answers FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create answers" 
ON public.answers FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own answers" 
ON public.answers FOR UPDATE 
USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own answers" 
ON public.answers FOR DELETE 
USING (auth.uid() = author_id);

-- Create triggers for updated_at
CREATE TRIGGER qna_categories_updated_at
    BEFORE UPDATE ON public.qna_categories
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER questions_updated_at
    BEFORE UPDATE ON public.questions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER answers_updated_at
    BEFORE UPDATE ON public.answers
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create function to update question answers count
CREATE OR REPLACE FUNCTION public.update_question_answers_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.questions 
        SET answers_count = answers_count + 1
        WHERE id = NEW.question_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.questions 
        SET answers_count = GREATEST(0, answers_count - 1)
        WHERE id = OLD.question_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for answers count
CREATE TRIGGER answers_update_question_count_insert
    AFTER INSERT ON public.answers
    FOR EACH ROW
    EXECUTE FUNCTION public.update_question_answers_count();

CREATE TRIGGER answers_update_question_count_delete
    AFTER DELETE ON public.answers
    FOR EACH ROW
    EXECUTE FUNCTION public.update_question_answers_count();

-- Create indexes
CREATE INDEX IF NOT EXISTS qna_categories_slug_idx ON public.qna_categories(slug);
CREATE INDEX IF NOT EXISTS qna_categories_sort_order_idx ON public.qna_categories(sort_order);
CREATE INDEX IF NOT EXISTS qna_categories_is_active_idx ON public.qna_categories(is_active);

CREATE INDEX IF NOT EXISTS questions_author_id_idx ON public.questions(author_id);
CREATE INDEX IF NOT EXISTS questions_category_id_idx ON public.questions(category_id);
CREATE INDEX IF NOT EXISTS questions_slug_idx ON public.questions(slug);
CREATE INDEX IF NOT EXISTS questions_created_at_idx ON public.questions(created_at DESC);
CREATE INDEX IF NOT EXISTS questions_views_idx ON public.questions(views DESC);
CREATE INDEX IF NOT EXISTS questions_upvotes_idx ON public.questions(upvotes DESC);
CREATE INDEX IF NOT EXISTS questions_is_solved_idx ON public.questions(is_solved);
CREATE INDEX IF NOT EXISTS questions_is_featured_idx ON public.questions(is_featured);
CREATE INDEX IF NOT EXISTS questions_tags_idx ON public.questions USING GIN(tags);

CREATE INDEX IF NOT EXISTS answers_author_id_idx ON public.answers(author_id);
CREATE INDEX IF NOT EXISTS answers_question_id_idx ON public.answers(question_id);
CREATE INDEX IF NOT EXISTS answers_created_at_idx ON public.answers(created_at DESC);
CREATE INDEX IF NOT EXISTS answers_upvotes_idx ON public.answers(upvotes DESC);
CREATE INDEX IF NOT EXISTS answers_is_accepted_idx ON public.answers(is_accepted);
CREATE INDEX IF NOT EXISTS answers_is_flagged_idx ON public.answers(is_flagged);

-- Insert default QnA categories
INSERT INTO public.qna_categories (name, slug, description, sort_order) VALUES
('Genel Sorular', 'genel-sorular', 'Genel yemek pişirme soruları', 1),
('Malzeme Soruları', 'malzeme-sorulari', 'Malzemeler hakkında sorular', 2),
('Pişirme Teknikleri', 'pisirme-teknikleri', 'Pişirme teknikleri ve yöntemleri', 3),
('Beslenme', 'beslenme', 'Beslenme ve diyet soruları', 4),
('Mutfak Aletleri', 'mutfak-aletleri', 'Mutfak aletleri ve kullanımı', 5),
('Saklama', 'saklama', 'Yemek saklama ve muhafaza', 6),
('Alternatif Malzemeler', 'alternatif-malzemeler', 'Malzeme ikame ve alternatifleri', 7),
('Tarif İpuçları', 'tarif-ipuclari', 'Tarif geliştirme ve ipuçları', 8)
ON CONFLICT (slug) DO NOTHING;
