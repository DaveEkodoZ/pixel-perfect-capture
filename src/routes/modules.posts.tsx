import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Plus, Eye, Heart, Newspaper, TrendingUp, Mail } from "lucide-react";
import { ModuleLayout } from "@/components/ModuleLayout";
import { KpiCard, SectionCard, AreaTrend, BarsCompare } from "@/components/dashboard";
import { EntityModal, RowActions, type ModalField } from "@/components/EntityModal";
import { Button } from "@/components/ui/button";
import { posts as seed } from "@/lib/mock-data";
import { getAuth } from "@/lib/auth";

export const Route = createFileRoute("/modules/posts")({
  head: () => ({ meta: [{ title: "Posts Actualité — CUY" }] }),
  component: Page,
});

const VIEWS = [
  { label: "Jan", value: 1200 }, { label: "Fév", value: 1820 }, { label: "Mar", value: 2100 },
  { label: "Avr", value: 1980 }, { label: "Mai", value: 2547 },
];

type Post = (typeof seed)[number];

const FIELDS: ModalField[] = [
  { name: "titre", label: "Titre", required: true, placeholder: "Lancement du programme..." },
  { name: "contenu", label: "Contenu", type: "textarea", required: true },
  { name: "contact", label: "Contact email", type: "email", placeholder: "contact@cuy.cm" },
  { name: "cover", label: "Image (URL)", type: "url", placeholder: "https://..." },
];

function Page() {
  const navigate = useNavigate();
  useEffect(() => { if (!getAuth()) navigate({ to: "/login" }); }, [navigate]);

  const [rows, setRows] = useState<Post[]>(seed);
  const [section, setSection] = useState("overview");
  const [modal, setModal] = useState<{ mode: "info" | "add" | "edit" | "confirm"; row?: Post } | null>(null);
  const [draft, setDraft] = useState<Record<string, any>>({});

  const published = rows.filter((p) => p.est_active).length;
  const archived = rows.length - published;
  const totalVues = rows.reduce((a, p) => a + p.nb_vues, 0);
  const totalLikes = rows.reduce((a, p) => a + p.nb_likes, 0);
  const engagement = totalVues ? Math.round((totalLikes / totalVues) * 1000) / 10 : 0;
  const topPosts = [...rows].sort((a, b) => b.nb_vues - a.nb_vues).map((p) => ({ label: p.titre.slice(0, 16) + "…", value: p.nb_vues }));

  const counts = { all: rows.length, published, archived };
  const filtered = useMemo(() => {
    if (section === "published") return rows.filter((p) => p.est_active);
    if (section === "archived") return rows.filter((p) => !p.est_active);
    return rows;
  }, [rows, section]);

  const openAdd = () => { setDraft({ cover: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800" }); setModal({ mode: "add" }); };
  const openEdit = (row: Post) => { setDraft(row); setModal({ mode: "edit", row }); };
  const openInfo = (row: Post) => setModal({ mode: "info", row });
  const openDelete = (row: Post) => setModal({ mode: "confirm", row });
  const toggle = (row: Post) => setRows((r) => r.map((p) => p.id === row.id ? { ...p, est_active: !p.est_active } : p));
  const close = () => setModal(null);
  const submit = () => {
    if (!modal) return;
    if (modal.mode === "add") {
      const id = Math.max(0, ...rows.map((r) => r.id)) + 1;
      setRows((r) => [{ id, est_active: true, nb_vues: 0, nb_likes: 0, contact: null, ...draft } as Post, ...r]);
    } else if (modal.mode === "edit" && modal.row) {
      setRows((r) => r.map((p) => p.id === modal.row!.id ? { ...p, ...draft } as Post : p));
    } else if (modal.mode === "confirm" && modal.row) {
      setRows((r) => r.filter((p) => p.id !== modal.row!.id));
    }
    close();
  };

  return (
    <ModuleLayout
      moduleKey="posts" activeSection={section} onSectionChange={setSection} sectionCounts={counts}
      title={titleFor(section)} description="Publications diffusées aux citoyens."
      actions={section !== "overview" && section !== "stats" ? <Button size="sm" onClick={openAdd}><Plus className="h-4 w-4 mr-1.5" /> Nouvelle actualité</Button> : undefined}
    >
      {section === "overview" && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <KpiCard label="Publications" value={rows.length} hint={`${published} en ligne`} icon={<Newspaper className="h-5 w-5" />} tone="primary" />
            <KpiCard label="Vues totales" value={totalVues.toLocaleString()} delta={24} icon={<Eye className="h-5 w-5" />} />
            <KpiCard label="Likes" value={totalLikes.toLocaleString()} delta={11} icon={<Heart className="h-5 w-5" />} />
            <KpiCard label="Engagement" value={`${engagement}%`} delta={2} icon={<TrendingUp className="h-5 w-5" />} tone="info" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            <SectionCard title="Vues mensuelles" className="lg:col-span-3"><AreaTrend data={VIEWS} /></SectionCard>
            <SectionCard title="Top publications" className="lg:col-span-2"><BarsCompare data={topPosts} height={200} /></SectionCard>
          </div>
        </>
      )}

      {section === "stats" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <SectionCard title="Évolution des vues"><AreaTrend data={VIEWS} height={260} /></SectionCard>
          <SectionCard title="Top publications"><BarsCompare data={topPosts} height={260} /></SectionCard>
        </div>
      )}

      {(section === "all" || section === "published" || section === "archived") && (
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
                {p.contact && <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground"><Mail className="h-3.5 w-3.5" />{p.contact}</div>}
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-3">
                  <span className="inline-flex items-center gap-1.5"><Eye className="h-3.5 w-3.5" />{p.nb_vues.toLocaleString()}</span>
                  <span className="inline-flex items-center gap-1.5"><Heart className="h-3.5 w-3.5" />{p.nb_likes.toLocaleString()}</span>
                </div>
                <div className="mt-3 -mb-1">
                  <RowActions onInfo={() => openInfo(p)} onEdit={() => openEdit(p)} onToggle={() => toggle(p)} isActive={p.est_active} onDelete={() => openDelete(p)} />
                </div>
              </div>
            </article>
          ))}
          {filtered.length === 0 && <div className="col-span-full text-center text-sm text-muted-foreground py-12">Aucune publication.</div>}
        </div>
      )}

      {modal && (
        <EntityModal
          open mode={modal.mode}
          title={modal.mode === "info" ? modal.row?.titre : modal.mode === "add" ? "Nouvelle actualité" : modal.mode === "edit" ? "Modifier l'actualité" : "Supprimer cette publication ?"}
          description={modal.mode === "confirm" ? "Cette publication sera définitivement supprimée." : undefined}
          destructive={modal.mode === "confirm"}
          fields={FIELDS} data={draft} onChange={(k, v) => setDraft((d) => ({ ...d, [k]: v }))}
          infoRows={modal.mode === "info" && modal.row ? [
            { label: "Titre", value: modal.row.titre },
            { label: "Contenu", value: modal.row.contenu },
            { label: "Contact", value: modal.row.contact ?? "—" },
            { label: "Vues", value: modal.row.nb_vues.toLocaleString() },
            { label: "Likes", value: modal.row.nb_likes.toLocaleString() },
            { label: "Statut", value: modal.row.est_active ? "Publié" : "Archivé" },
          ] : undefined}
          onClose={close} onSubmit={submit}
          submitLabel={modal.mode === "confirm" ? "Supprimer" : undefined}
        />
      )}
    </ModuleLayout>
  );
}

function titleFor(s: string) {
  switch (s) {
    case "overview": return "Vue d'ensemble — Posts";
    case "all": return "Toutes les publications";
    case "published": return "Publications en ligne";
    case "archived": return "Publications archivées";
    case "stats": return "Statistiques détaillées";
    default: return "Posts";
  }
}
