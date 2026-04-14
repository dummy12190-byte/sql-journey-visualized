
-- Create roadmaps table
CREATE TABLE public.roadmaps (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT '📚',
  accent_color text NOT NULL DEFAULT '#22c55e',
  status text NOT NULL DEFAULT 'published',
  estimated_time integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Roadmaps are publicly readable" ON public.roadmaps FOR SELECT USING (true);
CREATE POLICY "Anyone can insert roadmaps" ON public.roadmaps FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update roadmaps" ON public.roadmaps FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete roadmaps" ON public.roadmaps FOR DELETE USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_roadmaps_updated_at
  BEFORE UPDATE ON public.roadmaps
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default SQL roadmap
INSERT INTO public.roadmaps (id, name, description, icon, accent_color, status)
VALUES ('00000000-0000-0000-0000-000000000001', 'SQL', 'Master SQL from basics to advanced queries', '🗄️', '#22c55e', 'published');

-- Add roadmap_id, estimated_time, sort_order to roadmap_nodes
ALTER TABLE public.roadmap_nodes
  ADD COLUMN roadmap_id uuid REFERENCES public.roadmaps(id) ON DELETE CASCADE,
  ADD COLUMN estimated_time integer NOT NULL DEFAULT 30,
  ADD COLUMN sort_order integer NOT NULL DEFAULT 0;

-- Assign all existing nodes to the default SQL roadmap
UPDATE public.roadmap_nodes SET roadmap_id = '00000000-0000-0000-0000-000000000001';

-- Make roadmap_id NOT NULL after backfill
ALTER TABLE public.roadmap_nodes ALTER COLUMN roadmap_id SET NOT NULL;

-- Add roadmap_id to user_progress
ALTER TABLE public.user_progress
  ADD COLUMN roadmap_id uuid REFERENCES public.roadmaps(id) ON DELETE CASCADE;

-- Backfill existing progress
UPDATE public.user_progress SET roadmap_id = '00000000-0000-0000-0000-000000000001';

-- Enable realtime for roadmaps
ALTER PUBLICATION supabase_realtime ADD TABLE public.roadmaps;
