-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  fullname TEXT NOT NULL,
  user_group TEXT DEFAULT 'Herkes',
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (id)
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create categories table
CREATE TABLE public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone" 
  ON public.categories FOR SELECT USING (true);

-- Create recipes table
CREATE TABLE public.recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  ingredients JSONB,
  instructions JSONB,
  category_id UUID REFERENCES public.categories(id),
  user_id UUID REFERENCES public.profiles(id),
  image_url TEXT,
  prep_time INTEGER,
  cook_time INTEGER,
  servings INTEGER,
  difficulty TEXT,
  is_featured BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Recipes are viewable by everyone" 
  ON public.recipes FOR SELECT USING (true);

CREATE POLICY "Users can create recipes" 
  ON public.recipes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recipes" 
  ON public.recipes FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own recipes" 
  ON public.recipes FOR DELETE USING (auth.uid() = user_id);

-- Create questions table
CREATE TABLE public.questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  user_id UUID REFERENCES public.profiles(id),
  username TEXT,
  fullname TEXT,
  category TEXT,
  tags TEXT[],
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  answer_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Questions are viewable by everyone" 
  ON public.questions FOR SELECT USING (true);

CREATE POLICY "Users can create questions" 
  ON public.questions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own questions" 
  ON public.questions FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own questions" 
  ON public.questions FOR DELETE USING (auth.uid() = user_id);

-- Create answers table
CREATE TABLE public.answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  user_id UUID REFERENCES public.profiles(id),
  username TEXT,
  fullname TEXT,
  likes INTEGER DEFAULT 0,
  is_accepted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Answers are viewable by everyone" 
  ON public.answers FOR SELECT USING (true);

CREATE POLICY "Users can create answers" 
  ON public.answers FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own answers" 
  ON public.answers FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own answers" 
  ON public.answers FOR DELETE USING (auth.uid() = user_id);

-- Create question_likes table
CREATE TABLE public.question_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  is_like BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(question_id, user_id)
);

ALTER TABLE public.question_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Question likes are viewable by everyone" 
  ON public.question_likes FOR SELECT USING (true);

CREATE POLICY "Users can manage own question likes" 
  ON public.question_likes FOR ALL USING (auth.uid() = user_id);

-- Create answer_likes table
CREATE TABLE public.answer_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  answer_id UUID REFERENCES public.answers(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  is_like BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(answer_id, user_id)
);

ALTER TABLE public.answer_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Answer likes are viewable by everyone" 
  ON public.answer_likes FOR SELECT USING (true);

CREATE POLICY "Users can manage own answer likes" 
  ON public.answer_likes FOR ALL USING (auth.uid() = user_id);

-- Create video_stories table
CREATE TABLE public.video_stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  recipe_id UUID REFERENCES public.recipes(id),
  user_id UUID REFERENCES public.profiles(id),
  duration INTEGER,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.video_stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Video stories are viewable by everyone" 
  ON public.video_stories FOR SELECT USING (true);

CREATE POLICY "Users can create video stories" 
  ON public.video_stories FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own video stories" 
  ON public.video_stories FOR UPDATE USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_recipes_updated_at
  BEFORE UPDATE ON public.recipes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_questions_updated_at
  BEFORE UPDATE ON public.questions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_answers_updated_at
  BEFORE UPDATE ON public.answers
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_video_stories_updated_at
  BEFORE UPDATE ON public.video_stories
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();