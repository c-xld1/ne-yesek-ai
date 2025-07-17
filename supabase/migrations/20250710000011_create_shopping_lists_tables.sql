-- Create shopping_lists table
CREATE TABLE IF NOT EXISTS public.shopping_lists (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    is_shared BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create shopping_list_items table
CREATE TABLE IF NOT EXISTS public.shopping_list_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    shopping_list_id UUID REFERENCES public.shopping_lists(id) ON DELETE CASCADE NOT NULL,
    ingredient_name TEXT NOT NULL,
    quantity TEXT,
    unit TEXT,
    category TEXT,
    is_purchased BOOLEAN DEFAULT FALSE,
    notes TEXT,
    recipe_id UUID REFERENCES public.recipes(id) ON DELETE SET NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_list_items ENABLE ROW LEVEL SECURITY;

-- Create policies for shopping_lists
CREATE POLICY "Users can view their own shopping lists" 
ON public.shopping_lists FOR SELECT 
USING (auth.uid() = user_id OR is_shared = true);

CREATE POLICY "Users can insert their own shopping lists" 
ON public.shopping_lists FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own shopping lists" 
ON public.shopping_lists FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own shopping lists" 
ON public.shopping_lists FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for shopping_list_items
CREATE POLICY "Users can view items of their own shopping lists" 
ON public.shopping_list_items FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.shopping_lists 
        WHERE id = shopping_list_items.shopping_list_id 
        AND (user_id = auth.uid() OR is_shared = true)
    )
);

CREATE POLICY "Users can insert items to their own shopping lists" 
ON public.shopping_list_items FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.shopping_lists 
        WHERE id = shopping_list_items.shopping_list_id 
        AND user_id = auth.uid()
    )
);

CREATE POLICY "Users can update items of their own shopping lists" 
ON public.shopping_list_items FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM public.shopping_lists 
        WHERE id = shopping_list_items.shopping_list_id 
        AND user_id = auth.uid()
    )
);

CREATE POLICY "Users can delete items of their own shopping lists" 
ON public.shopping_list_items FOR DELETE 
USING (
    EXISTS (
        SELECT 1 FROM public.shopping_lists 
        WHERE id = shopping_list_items.shopping_list_id 
        AND user_id = auth.uid()
    )
);

-- Create triggers for updated_at
CREATE TRIGGER shopping_lists_updated_at
    BEFORE UPDATE ON public.shopping_lists
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER shopping_list_items_updated_at
    BEFORE UPDATE ON public.shopping_list_items
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes
CREATE INDEX IF NOT EXISTS shopping_lists_user_id_idx ON public.shopping_lists(user_id);
CREATE INDEX IF NOT EXISTS shopping_lists_is_shared_idx ON public.shopping_lists(is_shared);
CREATE INDEX IF NOT EXISTS shopping_lists_created_at_idx ON public.shopping_lists(created_at DESC);

CREATE INDEX IF NOT EXISTS shopping_list_items_shopping_list_id_idx ON public.shopping_list_items(shopping_list_id);
CREATE INDEX IF NOT EXISTS shopping_list_items_recipe_id_idx ON public.shopping_list_items(recipe_id);
CREATE INDEX IF NOT EXISTS shopping_list_items_category_idx ON public.shopping_list_items(category);
CREATE INDEX IF NOT EXISTS shopping_list_items_is_purchased_idx ON public.shopping_list_items(is_purchased);
CREATE INDEX IF NOT EXISTS shopping_list_items_sort_order_idx ON public.shopping_list_items(sort_order);
