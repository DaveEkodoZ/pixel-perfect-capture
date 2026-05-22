import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Eye, Heart, Newspaper, Mail } from "lucide-react";
import { ModuleLayout } from "@/components/ModuleLayout";
import { StatCard } from "@/components/module-bits";
import { Button } from "@/components/ui/button";
import { posts } from "@/lib/mock-data";
import { getAuth } from "@/lib/auth";

export const Route = createFileRoute("/modules/posts")({
  head: () => ({ meta: [{ title: "Posts Actualité — CUY" }] }),
  component: Page,
});

function Page() {
  const navigate = useNavigate();
  useEffect(() => { if (!getAuth()) navigate({ to: "/login" }); }, [navigate]);

  const [tab, setTab] = useState<"all" | "active" | "inactive">("all");
  const filtered = posts.filter((p) =>
    tab === "all" ? true : tab === "active" ? p.est_active : !p.est_active
  );
  const totalVues = posts.reduce((a, p) => a + p.nb_vues, 0);
  const totalLikes = posts.reduce((a, p) => a + p.nb_likes, 0);

  return (
    <ModuleLayout
      title="Posts Actualité"
      description="Publiez et modérez les actualités diffusées aux citoyens."
      tabs={[
        { key: "all", label: `Tous (${posts.length})`, active: tab === "all", onClick: () => setTab("all") },
        { key: "active", label: "Publiés", active: tab === "active", onClick: () => setTab("active") },
        { key: "inactive", label: "Archivés", active: tab === "inactive", onClick: () => setTab("inactive") },
      ]}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Publications" value={posts.length} icon={<Newspaper className="h-5 w-5" />} />
        <StatCard label="Vues totales" value={totalVues.toLocaleString()} icon={<Eye className="h-5 w-5" />} />
        <StatCard label="Likes" value={totalLikes.toLocaleString()} icon={<Heart className="h-5 w-5" />} />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-muted-foreground">Toutes les publications</h2>
        <Button size="sm"><Plus className="h-4 w-4 mr-1.5" /> Nouvelle actualité</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((p) => (
          <article key={p.id} className="group rounded-xl border border-border bg-card overflow-hidden hover:border-primary/40 transition-colors">
            <div className="aspect-[16/10] overflow-hidden bg-muted relative">
              <img src={p.cover} alt={p.titre} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <span className={`absolute top-3 left-3 rounded-full px-2.5 py-0.5 text-xs font-medium ${p.est_active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
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
    </ModuleLayout>
  );
}
