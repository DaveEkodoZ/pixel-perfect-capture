import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Eye, Heart, Image as ImageIcon } from "lucide-react";
import { ModuleLayout } from "@/components/ModuleLayout";
import { StatCard } from "@/components/module-bits";
import { Button } from "@/components/ui/button";
import { stories } from "@/lib/mock-data";
import { getAuth } from "@/lib/auth";

export const Route = createFileRoute("/modules/stories")({
  head: () => ({ meta: [{ title: "Stories — CUY" }] }),
  component: Page,
});

function Page() {
  const navigate = useNavigate();
  useEffect(() => { if (!getAuth()) navigate({ to: "/login" }); }, [navigate]);

  const [tab, setTab] = useState<"active" | "all">("active");
  const filtered = tab === "active" ? stories.filter((s) => s.est_active) : stories;
  const totalVues = stories.reduce((a, s) => a + s.nb_vues, 0);

  return (
    <ModuleLayout
      title="Stories"
      description="Contenus éphémères diffusés aux citoyens sur mobile."
      tabs={[
        { key: "active", label: "Actives", active: tab === "active", onClick: () => setTab("active") },
        { key: "all", label: `Toutes (${stories.length})`, active: tab === "all", onClick: () => setTab("all") },
      ]}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Stories" value={stories.length} icon={<ImageIcon className="h-5 w-5" />} />
        <StatCard label="Vues cumulées" value={totalVues.toLocaleString()} icon={<Eye className="h-5 w-5" />} />
        <StatCard label="Likes cumulés" value={stories.reduce((a, s) => a + s.nb_likes, 0)} icon={<Heart className="h-5 w-5" />} />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-muted-foreground">Galerie</h2>
        <Button size="sm"><Plus className="h-4 w-4 mr-1.5" /> Nouvelle story</Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filtered.map((s) => (
          <div key={s.id} className="relative aspect-[9/16] rounded-xl overflow-hidden border border-border group">
            <img src={s.url_media} alt="story" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <span className={`absolute top-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-semibold ${s.est_active ? "bg-primary text-primary-foreground" : "bg-black/60 text-white"}`}>
              {s.est_active ? "En ligne" : "Hors ligne"}
            </span>
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
              <span className="inline-flex items-center gap-1"><Eye className="h-3 w-3" />{s.nb_vues}</span>
              <span className="inline-flex items-center gap-1"><Heart className="h-3 w-3" />{s.nb_likes}</span>
            </div>
          </div>
        ))}
      </div>
    </ModuleLayout>
  );
}
