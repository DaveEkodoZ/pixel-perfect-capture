import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Plus, Eye, Heart, Clock, Play } from "lucide-react";
import { ModuleLayout } from "@/components/ModuleLayout";
import { KpiCard, SectionCard, BarsCompare } from "@/components/dashboard";
import { EntityModal, RowActions, type ModalField } from "@/components/EntityModal";
import { Button } from "@/components/ui/button";
import { stories as seed } from "@/lib/mock-data";
import { getAuth } from "@/lib/auth";

export const Route = createFileRoute("/modules/stories")({
  head: () => ({ meta: [{ title: "Stories — CUY" }] }),
  component: Page,
});

type Story = (typeof seed)[number];

const FIELDS: ModalField[] = [
  { name: "url_media", label: "URL du média", type: "url", required: true, placeholder: "https://..." },
];

function Page() {
  const navigate = useNavigate();
  useEffect(() => { if (!getAuth()) navigate({ to: "/login" }); }, [navigate]);

  const [rows, setRows] = useState<Story[]>(seed);
  const [section, setSection] = useState("overview");
  const [modal, setModal] = useState<{ mode: "info" | "add" | "edit" | "confirm"; row?: Story } | null>(null);
  const [draft, setDraft] = useState<Record<string, any>>({});

  const online = rows.filter((s) => s.est_active).length;
  const offline = rows.length - online;
  const totalVues = rows.reduce((a, s) => a + s.nb_vues, 0);
  const totalLikes = rows.reduce((a, s) => a + s.nb_likes, 0);

  const counts = { all: rows.length, online, offline };
  const filtered = useMemo(() => {
    if (section === "online") return rows.filter((s) => s.est_active);
    if (section === "offline") return rows.filter((s) => !s.est_active);
    return rows;
  }, [rows, section]);

  const perStory = rows.map((s, i) => ({ label: `S${i + 1}`, value: s.nb_vues }));

  const openAdd = () => { setDraft({}); setModal({ mode: "add" }); };
  const openEdit = (row: Story) => { setDraft(row); setModal({ mode: "edit", row }); };
  const openInfo = (row: Story) => setModal({ mode: "info", row });
  const openDelete = (row: Story) => setModal({ mode: "confirm", row });
  const toggle = (row: Story) => setRows((r) => r.map((s) => s.id === row.id ? { ...s, est_active: !s.est_active } : s));
  const close = () => setModal(null);
  const submit = () => {
    if (!modal) return;
    if (modal.mode === "add") {
      const id = Math.max(0, ...rows.map((r) => r.id)) + 1;
      setRows((r) => [{ id, est_active: true, nb_vues: 0, nb_likes: 0, ...draft } as Story, ...r]);
    } else if (modal.mode === "edit" && modal.row) {
      setRows((r) => r.map((s) => s.id === modal.row!.id ? { ...s, ...draft } as Story : s));
    } else if (modal.mode === "confirm" && modal.row) {
      setRows((r) => r.filter((s) => s.id !== modal.row!.id));
    }
    close();
  };

  return (
    <ModuleLayout
      moduleKey="stories" activeSection={section} onSectionChange={setSection} sectionCounts={counts}
      title={titleFor(section)} description="Diffusion éphémère pour engager les citoyens."
      actions={section !== "overview" && section !== "stats" ? <Button size="sm" onClick={openAdd}><Plus className="h-4 w-4 mr-1.5" /> Nouvelle story</Button> : undefined}
    >
      {section === "overview" && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <KpiCard label="Stories en ligne" value={online} hint={`${rows.length} au total`} icon={<Play className="h-5 w-5" />} tone="primary" />
            <KpiCard label="Vues cumulées" value={totalVues.toLocaleString()} delta={32} icon={<Eye className="h-5 w-5" />} />
            <KpiCard label="Likes" value={totalLikes.toLocaleString()} delta={14} icon={<Heart className="h-5 w-5" />} />
            <KpiCard label="Durée moyenne" value="18s" hint="visionnage" icon={<Clock className="h-5 w-5" />} tone="info" />
          </div>
          <SectionCard title="Performances par story" subtitle="Nombre de vues"><BarsCompare data={perStory} /></SectionCard>
        </>
      )}

      {section === "stats" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <SectionCard title="Vues par story"><BarsCompare data={perStory} height={260} /></SectionCard>
          <SectionCard title="Engagement">
            <div className="space-y-4">
              {[
                { l: "Taux de complétion", v: 76 },
                { l: "Taux de like", v: totalVues ? Math.round(totalLikes / totalVues * 100) : 0 },
                { l: "Partages", v: 42 },
              ].map((b) => (
                <div key={b.l}>
                  <div className="flex justify-between text-sm mb-1.5"><span>{b.l}</span><span className="font-semibold">{b.v}%</span></div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden"><div className="h-full bg-gradient-to-r from-primary to-primary-glow" style={{ width: `${b.v}%` }} /></div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      )}

      {(section === "all" || section === "online" || section === "offline") && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((s) => (
            <div key={s.id} className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="relative aspect-[9/16] group">
                <img src={s.url_media} alt="story" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <span className={`absolute top-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-semibold ${s.est_active ? "bg-primary text-primary-foreground" : "bg-black/60 text-white"}`}>
                  {s.est_active ? "En ligne" : "Hors ligne"}
                </span>
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white text-xs">
                  <span className="inline-flex items-center gap-1"><Eye className="h-3 w-3" />{s.nb_vues}</span>
                  <span className="inline-flex items-center gap-1"><Heart className="h-3 w-3" />{s.nb_likes}</span>
                </div>
              </div>
              <div className="p-2 border-t border-border">
                <RowActions onInfo={() => openInfo(s)} onEdit={() => openEdit(s)} onToggle={() => toggle(s)} isActive={s.est_active} onDelete={() => openDelete(s)} />
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="col-span-full text-center text-sm text-muted-foreground py-12">Aucune story.</div>}
        </div>
      )}

      {modal && (
        <EntityModal
          open mode={modal.mode}
          title={modal.mode === "info" ? `Story #${modal.row?.id}` : modal.mode === "add" ? "Nouvelle story" : modal.mode === "edit" ? "Modifier la story" : "Supprimer cette story ?"}
          destructive={modal.mode === "confirm"}
          fields={FIELDS} data={draft} onChange={(k, v) => setDraft((d) => ({ ...d, [k]: v }))}
          infoRows={modal.mode === "info" && modal.row ? [
            { label: "Média", value: <img src={modal.row.url_media} alt="" className="w-32 rounded-md" /> },
            { label: "Vues", value: modal.row.nb_vues },
            { label: "Likes", value: modal.row.nb_likes },
            { label: "Statut", value: modal.row.est_active ? "En ligne" : "Hors ligne" },
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
    case "overview": return "Vue d'ensemble — Stories";
    case "all": return "Toutes les stories";
    case "online": return "Stories en ligne";
    case "offline": return "Stories hors ligne";
    case "stats": return "Performances détaillées";
    default: return "Stories";
  }
}
