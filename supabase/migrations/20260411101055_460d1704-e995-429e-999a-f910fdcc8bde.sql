
CREATE TABLE public.roadmap_nodes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  difficulty TEXT NOT NULL DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  resources JSONB NOT NULL DEFAULT '[]'::jsonb,
  position_x NUMERIC NOT NULL DEFAULT 0,
  position_y NUMERIC NOT NULL DEFAULT 0,
  connections TEXT[] NOT NULL DEFAULT '{}',
  video_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.roadmap_nodes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Roadmap nodes are publicly readable"
  ON public.roadmap_nodes FOR SELECT USING (true);

CREATE POLICY "Anyone can insert roadmap nodes"
  ON public.roadmap_nodes FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update roadmap nodes"
  ON public.roadmap_nodes FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete roadmap nodes"
  ON public.roadmap_nodes FOR DELETE USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.roadmap_nodes;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_roadmap_nodes_updated_at
  BEFORE UPDATE ON public.roadmap_nodes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.user_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  node_id TEXT NOT NULL REFERENCES public.roadmap_nodes(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  browser_id TEXT NOT NULL,
  UNIQUE(node_id, browser_id)
);

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Progress is publicly readable"
  ON public.user_progress FOR SELECT USING (true);

CREATE POLICY "Anyone can insert progress"
  ON public.user_progress FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can delete progress"
  ON public.user_progress FOR DELETE USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.user_progress;
