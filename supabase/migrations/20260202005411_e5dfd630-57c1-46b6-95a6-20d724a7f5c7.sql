-- Create home items table for "Construindo o Lar" feature
CREATE TABLE public.home_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id UUID NOT NULL REFERENCES public.couple_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  room TEXT NOT NULL, -- sala, quarto, cozinha, banheiro, etc.
  item_type TEXT NOT NULL, -- moveis, eletrodomesticos, decoracao, utensilios
  estimated_price NUMERIC DEFAULT 0,
  actual_price NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'pending', -- pending, purchased
  priority TEXT DEFAULT 'medium', -- low, medium, high
  store_link TEXT,
  image_url TEXT,
  notes TEXT,
  purchased_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.home_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their couple home items"
ON public.home_items
FOR SELECT
USING (has_couple_access(couple_id));

CREATE POLICY "Users can create home items for their couple"
ON public.home_items
FOR INSERT
WITH CHECK (has_couple_access(couple_id));

CREATE POLICY "Users can update their couple home items"
ON public.home_items
FOR UPDATE
USING (has_couple_access(couple_id));

CREATE POLICY "Users can delete their couple home items"
ON public.home_items
FOR DELETE
USING (has_couple_access(couple_id));

-- Create trigger for updated_at
CREATE TRIGGER update_home_items_updated_at
BEFORE UPDATE ON public.home_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for home item images
INSERT INTO storage.buckets (id, name, public) VALUES ('home-items', 'home-items', true);

-- Storage policies for home item images
CREATE POLICY "Home item images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'home-items');

CREATE POLICY "Authenticated users can upload home item images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'home-items' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their home item images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'home-items' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their home item images"
ON storage.objects FOR DELETE
USING (bucket_id = 'home-items' AND auth.role() = 'authenticated');