import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import type { Roadmap } from "@/hooks/useRoadmaps";

const EMOJI_OPTIONS = ["🗄️", "🐍", "⚛️", "🧮", "☕", "🦀", "🎨", "📊", "🔧", "🌐", "📱", "🤖", "🧠", "💻", "📚"];

const COLOR_OPTIONS = [
  { label: "Green", value: "#22c55e" },
  { label: "Blue", value: "#3b82f6" },
  { label: "Cyan", value: "#06b6d4" },
  { label: "Purple", value: "#a855f7" },
  { label: "Amber", value: "#f59e0b" },
  { label: "Red", value: "#ef4444" },
  { label: "Pink", value: "#ec4899" },
  { label: "Teal", value: "#14b8a6" },
];

interface RoadmapForm {
  name: string;
  description: string;
  icon: string;
  accent_color: string;
  status: string;
}

const emptyForm: RoadmapForm = {
  name: "",
  description: "",
  icon: "📚",
  accent_color: "#22c55e",
  status: "published",
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingRoadmap: Roadmap | null;
  onSave: (form: RoadmapForm, editingId: string | null) => Promise<void>;
}

export default function AdminRoadmapDrawer({ open, onOpenChange, editingRoadmap, onSave }: Props) {
  const [form, setForm] = useState<RoadmapForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingRoadmap) {
      setForm({
        name: editingRoadmap.name,
        description: editingRoadmap.description,
        icon: editingRoadmap.icon,
        accent_color: editingRoadmap.accent_color,
        status: editingRoadmap.status,
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingRoadmap, open]);

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    await onSave(form, editingRoadmap?.id || null);
    setSaving(false);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md bg-card border-border overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="font-display text-foreground text-lg">
            {editingRoadmap ? "Edit Roadmap" : "Create Roadmap"}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-5">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Roadmap Name</label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Python, DSA, React"
              className="bg-secondary/60 border-border focus:border-primary/50"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Short description of this roadmap..."
              className="bg-secondary/60 border-border focus:border-primary/50 min-h-[80px]"
              rows={3}
            />
          </div>

          {/* Icon Picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Icon</label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setForm({ ...form, icon: emoji })}
                  className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center border transition-all duration-200 ${
                    form.icon === emoji
                      ? "border-primary bg-primary/10 scale-110"
                      : "border-border hover:border-muted-foreground/40"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Color Picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Accent Color</label>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setForm({ ...form, accent_color: c.value })}
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                    form.accent_color === c.value ? "border-foreground scale-110" : "border-transparent hover:scale-105"
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</label>
            <div className="grid grid-cols-2 gap-1.5">
              {["published", "draft"].map((s) => (
                <button
                  key={s}
                  onClick={() => setForm({ ...form, status: s })}
                  className={`px-3 py-2 rounded-md text-xs font-medium border transition-all duration-200 capitalize ${
                    form.status === s
                      ? s === "published"
                        ? "bg-primary/20 text-primary border-primary/40"
                        : "bg-warning/20 text-warning border-warning/40"
                      : "border-border text-muted-foreground hover:border-muted-foreground/40"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Save */}
          <Button
            onClick={handleSave}
            disabled={saving || !form.name.trim()}
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 font-medium"
          >
            {saving ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</>
            ) : editingRoadmap ? "Update Roadmap" : "Create Roadmap"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
