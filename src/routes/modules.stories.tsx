import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Eye, Heart, Image as ImageIcon, Clock, Play } from "lucide-react";
import { ModuleLayout } from "@/components/ModuleLayout";
import { KpiCard, SectionCard, BarsCompare } from "@/components/dashboard";
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
  const totalLikes = stories.reduce((a, s) => a + s.nb_likes, 0);
  const actives = stories.filter((s) => s.est_active).length;
  const perStory = stories.map((s, i) => ({ label: `S${i + 1}`, value: s.nb_vues }));

  return (
    <ModuleLayout
      title="Stories"
      description="Diffusion éphémère pour engager les citoyens en temps réel."
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Stories actives" value={actives} hint={`${stories.length} au total`} icon={<Play className="h-5 w-5" />} tone="primary" />
        <KpiCard label="Vues cumulées" value={totalVues.toLocaleString()} delta={32} icon={<Eye className="h-5 w-5" />} />
        <KpiCard label="Likes" value={totalLikes.toLocaleString()} delta={14} icon={<Heart className="h-5 w-5" />} />
        <KpiCard label="Durée moyenne" value="18s" hint="visionnage" icon={<Clock className="h-5 w-5" />} tone="info" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        <SectionCard title="Performances par story" subtitle="Nombre de vues" className="lg:col-span-2">
          <BarsCompare data={perStory} />
        </SectionCard>
        <SectionCard title="Engagement">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span>Taux de complétion</span><span className="font-semibold">76%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden"><div className="h-full bg-gradient-to-r from-primary to-primary-glow" style={{ width: "76%" }} /></div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span>Taux de like</span><span className="font-semibold">{Math.round(totalLikes/totalVues*100)}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden"><div className="h-full bg-gradient-to-r from-primary to-primary-glow" style={{ width: `${Math.round(totalLikes/totalVues*100)}%` }} /></div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span>Partages</span><span className="font-semibold">42%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden"><div className="h-full bg-gradient-to-r from-primary to-primary-glow" style={{ width: "42%" }} /></div>
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="Galerie"
        subtitle={`${filtered.length} ${tab === "active" ? "stories actives" : "stories"}`}
        action={
          <div className="flex items-center gap-2">
            <div className="hidden md:flex gap-1 rounded-lg bg-muted p-1">
              {[{ k: "active", l: "Actives" }, { k: "all", l: "Toutes" }].map((t) => (
                <button key={t.k} onClick={() => setTab(t.k as any)}
                  className={`px-3 py-1 text-xs font-medium rounded-md ${tab === t.k ? "bg-card shadow-sm" : "text-muted-foreground"}`}>
                  {t.l}
                </button>
              ))}
            </div>
            <Button size="sm"><Plus className="h-4 w-4 mr-1.5" /> Nouvelle story</Button>
          </div>
        }
      >
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
      </SectionCard>
    </ModuleLayout>
  );
}
