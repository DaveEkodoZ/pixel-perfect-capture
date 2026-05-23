import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Eye, Heart, Newspaper, Mail, TrendingUp } from "lucide-react";
import { ModuleLayout } from "@/components/ModuleLayout";
import { KpiCard, SectionCard, AreaTrend, BarsCompare } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { posts } from "@/lib/mock-data";
import { getAuth } from "@/lib/auth";

export const Route = createFileRoute("/modules/posts")({
  head: () => ({ meta: [{ title: "Posts Actualité — CUY" }] }),
  component: Page,
});

const VIEWS_TREND = [
  { label: "Jan", value: 1200 },
  { label: "Fév", value: 1820 },
  { label: "Mar", value: 2100 },
  { label: "Avr", value: 1980 },
  { label: "Mai", value: 2547 },
];

function Page() {
  const navigate = useNavigate();
  useEffect(() => { if (!getAuth()) navigate({ to: "/login" }); }, [navigate]);

  const [tab, setTab] = useState<"all" | "active" | "inactive">("all");
  const filtered = posts.filter((p) =>
    tab === "all" ? true : tab === "active" ? p.est_active : !p.est_active
  );
  const totalVues = posts.reduce((a, p) => a + p.nb_vues, 0);
  const totalLikes = posts.reduce((a, p) => a + p.nb_likes, 0);
  const engagement = Math.round((totalLikes / totalVues) * 1000) / 10;
  const published = posts.filter((p) => p.est_active).length;
  const topPosts = [...posts]
    .sort((a, b) => b.nb_vues - a.nb_vues)
    .map((p) => ({ label: p.titre.slice(0, 18) + "…", value: p.nb_vues }));

  return (
    <ModuleLayout
      title="Posts Actualité"
      description="Performances et publications diffusées aux citoyens."
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Publications" value={posts.length} hint={`${published} en ligne`} icon={<Newspaper className="h-5 w-5" />} tone="primary" />
        <KpiCard label="Vues totales" value={totalVues.toLocaleString()} delta={24} icon={<Eye className="h-5 w-5" />} />
        <KpiCard label="Likes" value={totalLikes.toLocaleString()} delta={11} icon={<Heart className="h-5 w-5" />} />
        <KpiCard label="Taux d'engagement" value={`${engagement}%`} delta={2} icon={<TrendingUp className="h-5 w-5" />} tone="info" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-6">
        <SectionCard title="Vues mensuelles" subtitle="Évolution sur 5 mois" className="lg:col-span-3">
          <AreaTrend data={VIEWS_TREND} />
        </SectionCard>
        <SectionCard title="Top publications" subtitle="Classées par vues" className="lg:col-span-2">
          <BarsCompare data={topPosts} height={200} />
        </SectionCard>
      </div>

      <SectionCard
        title="Toutes les publications"
        subtitle={`${posts.length} articles`}
        action={
          <div className="flex items-center gap-2">
            <div className="hidden md:flex gap-1 rounded-lg bg-muted p-1">
              {[{ k: "all", l: "Tous" }, { k: "active", l: "Publiés" }, { k: "inactive", l: "Archivés" }].map((t) => (
                <button key={t.k} onClick={() => setTab(t.k as any)}
                  className={`px-3 py-1 text-xs font-medium rounded-md ${tab === t.k ? "bg-card shadow-sm" : "text-muted-foreground"}`}>
                  {t.l}
                </button>
              ))}
            </div>
            <Button size="sm"><Plus className="h-4 w-4 mr-1.5" /> Nouvelle actualité</Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((p) => (
            <article key={p.id} className="group rounded-xl border border-border bg-card overflow-hidden hover:border-primary/40 hover:-translate-y-0.5 transition-all">
              <div className="aspect-[16/10] overflow-hidden bg-muted relative">
                <img src={p.cover} alt={p.titre} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className={`absolute top-3 left-3 rounded-full px-2.5 py-0.5 text-xs font-medium backdrop-blur ${p.est_active ? "bg-primary/90 text-primary-foreground" : "bg-black/60 text-white"}`}>
                  {p.est_active ? "Publié" : "Archivé"}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-bold leading-snug line-clamp-2">{p.titre}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.contenu}</p>
                {p.contact && (
                  <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />{p.contact}
                  </div>
                )}
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-3">
                  <span className="inline-flex items-center gap-1.5"><Eye className="h-3.5 w-3.5" />{p.nb_vues.toLocaleString()}</span>
                  <span className="inline-flex items-center gap-1.5"><Heart className="h-3.5 w-3.5" />{p.nb_likes.toLocaleString()}</span>
                  <button className="text-primary font-medium hover:underline">Gérer</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </SectionCard>
    </ModuleLayout>
  );
}
