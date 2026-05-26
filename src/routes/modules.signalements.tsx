import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState, lazy, Suspense } from "react";
import { AlertTriangle, MapPin, Calendar, Clock, CheckCircle2, Loader2, Plus } from "lucide-react";
import { ModuleLayout } from "@/components/ModuleLayout";
import { StatusPill } from "@/components/module-bits";
import { KpiCard, SectionCard, DonutBreakdown, AreaTrend } from "@/components/dashboard";
import { EntityModal, RowActions, type ModalField } from "@/components/EntityModal";
import { Button } from "@/components/ui/button";
import { signalements as seed } from "@/lib/mock-data";
import { getAuth } from "@/lib/auth";

const SignalementsMap = lazy(() =>
  import("@/components/SignalementsMap").then((m) => ({ default: m.SignalementsMap }))
);

export const Route = createFileRoute("/modules/signalements")({
  head: () => ({ meta: [{ title: "Signalements — CUY" }] }),
  component: Page,
});

const MONTHS = [
  { label: "Jan", value: 18 }, { label: "Fév", value: 22 }, { label: "Mar", value: 31 },
  { label: "Avr", value: 28 }, { label: "Mai", value: 42 },
];

type Sig = (typeof seed)[number];

const FIELDS: ModalField[] = [
  { name: "categorie", label: "Catégorie", type: "select", required: true, options: [
    { value: "Voirie", label: "Voirie" }, { value: "Éclairage", label: "Éclairage" },
    { value: "Déchets", label: "Déchets" }, { value: "Autres", label: "Autres" }] },
  { name: "description", label: "Description", type: "textarea", required: true },
  { name: "quartier", label: "Quartier", required: true, placeholder: "Bastos" },
  { name: "ville", label: "Ville", required: true, placeholder: "Yaoundé" },
  { name: "statut", label: "Statut", type: "select", required: true, options: [
    { value: "EN_ATTENTE", label: "En attente" }, { value: "EN_COURS", label: "En cours" }, { value: "RESOLU", label: "Résolu" }] },
  { name: "photo", label: "Photo (URL)", type: "url" },
  { name: "lat", label: "Latitude", placeholder: "3.8480" },
  { name: "lng", label: "Longitude", placeholder: "11.5021" },
];

function Page() {
  const navigate = useNavigate();
  useEffect(() => { if (!getAuth()) navigate({ to: "/login" }); }, [navigate]);

  const [rows, setRows] = useState<Sig[]>(seed);
  const [section, setSection] = useState("overview");
  const [modal, setModal] = useState<{ mode: "info" | "add" | "edit" | "confirm"; row?: Sig } | null>(null);
  const [draft, setDraft] = useState<Record<string, any>>({});

  const count = (st: string) => rows.filter((s) => s.statut === st).length;
  const taux = rows.length ? Math.round((count("RESOLU") / rows.length) * 100) : 0;

  const counts = { all: rows.length, map: rows.length, EN_ATTENTE: count("EN_ATTENTE"), EN_COURS: count("EN_COURS"), RESOLU: count("RESOLU") };
  const filtered = useMemo(() => section === "all" || section === "overview" || section === "map" ? rows : rows.filter((s) => s.statut === section), [rows, section]);

  const categories = Array.from(rows.reduce((m, s) => m.set(s.categorie, (m.get(s.categorie) ?? 0) + 1), new Map<string, number>()))
    .map(([label, value]) => ({ label, value }));

  const openAdd = () => { setDraft({ ville: "Yaoundé", statut: "EN_ATTENTE", lat: 3.8480, lng: 11.5021, photo: "https://images.unsplash.com/photo-1545158535-c3f7168c28b6?w=400" }); setModal({ mode: "add" }); };
  const openEdit = (row: Sig) => { setDraft(row); setModal({ mode: "edit", row }); };
  const openInfo = (row: Sig) => setModal({ mode: "info", row });
  const openDelete = (row: Sig) => setModal({ mode: "confirm", row });
  const close = () => setModal(null);
  const submit = () => {
    if (!modal) return;
    if (modal.mode === "add") {
      const id = Math.max(0, ...rows.map((r) => r.id)) + 1;
      const date = new Date().toISOString().slice(0, 10);
      setRows((r) => [{ id, date, ...draft, lat: Number(draft.lat), lng: Number(draft.lng) } as Sig, ...r]);
    } else if (modal.mode === "edit" && modal.row) {
      setRows((r) => r.map((s) => s.id === modal.row!.id ? { ...s, ...draft, lat: Number(draft.lat), lng: Number(draft.lng) } as Sig : s));
    } else if (modal.mode === "confirm" && modal.row) {
      setRows((r) => r.filter((s) => s.id !== modal.row!.id));
    }
    close();
  };

  return (
    <ModuleLayout
      moduleKey="signalements" activeSection={section} onSectionChange={setSection} sectionCounts={counts}
      title={titleFor(section)} description="Suivi opérationnel des signalements géolocalisés."
      actions={section !== "overview" ? <Button size="sm" onClick={openAdd}><Plus className="h-4 w-4 mr-1.5" /> Nouveau signalement</Button> : undefined}
    >
      {section === "overview" && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <KpiCard label="Total" value={rows.length} delta={9} icon={<AlertTriangle className="h-5 w-5" />} tone="primary" />
            <KpiCard label="En attente" value={count("EN_ATTENTE")} icon={<Clock className="h-5 w-5" />} tone="warning" />
            <KpiCard label="En cours" value={count("EN_COURS")} icon={<Loader2 className="h-5 w-5" />} tone="info" />
            <KpiCard label="Taux résolution" value={`${taux}%`} delta={4} hint={`${count("RESOLU")} résolus`} icon={<CheckCircle2 className="h-5 w-5" />} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            <SectionCard title="Évolution mensuelle" className="lg:col-span-3"><AreaTrend data={MONTHS} /></SectionCard>
            <SectionCard title="Par catégorie" className="lg:col-span-2"><DonutBreakdown data={categories} /></SectionCard>
          </div>
        </>
      )}

      {section === "map" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard label="Points cartographiés" value={rows.length} icon={<MapPin className="h-5 w-5" />} tone="primary" />
            <KpiCard label="En attente" value={count("EN_ATTENTE")} icon={<Clock className="h-5 w-5" />} tone="warning" />
            <KpiCard label="En cours" value={count("EN_COURS")} icon={<Loader2 className="h-5 w-5" />} tone="info" />
            <KpiCard label="Résolus" value={count("RESOLU")} icon={<CheckCircle2 className="h-5 w-5" />} />
          </div>
          <Suspense fallback={<div className="h-[540px] rounded-xl border border-border bg-muted/40 flex items-center justify-center text-sm text-muted-foreground">Chargement de la carte…</div>}>
            <SignalementsMap items={rows} onSelect={openInfo} />
          </Suspense>
        </div>
      )}

      {section !== "overview" && section !== "map" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((s) => (
            <article key={s.id} className="rounded-xl border border-border bg-card overflow-hidden flex hover:border-primary/40 transition-colors">
              <div className="w-32 sm:w-40 shrink-0 bg-muted">
                <img src={s.photo} alt={s.categorie} className="h-full w-full object-cover" />
              </div>
              <div className="p-5 flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">{s.categorie}</span>
                  <StatusPill status={s.statut} />
                </div>
                <p className="mt-2 text-sm font-medium line-clamp-2">{s.description}</p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{s.quartier}, {s.ville}</span>
                  <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{s.date}</span>
                </div>
                <div className="mt-3">
                  <RowActions onInfo={() => openInfo(s)} onEdit={() => openEdit(s)} onDelete={() => openDelete(s)} />
                </div>
              </div>
            </article>
          ))}
          {filtered.length === 0 && <div className="col-span-full text-center text-sm text-muted-foreground py-12">Aucun signalement.</div>}
        </div>
      )}

      {modal && (
        <EntityModal
          open mode={modal.mode}
          title={modal.mode === "info" ? `Signalement #${modal.row?.id}` : modal.mode === "add" ? "Nouveau signalement" : modal.mode === "edit" ? "Modifier le signalement" : "Supprimer ce dossier ?"}
          destructive={modal.mode === "confirm"}
          fields={FIELDS} data={draft} onChange={(k, v) => setDraft((d) => ({ ...d, [k]: v }))}
          infoRows={modal.mode === "info" && modal.row ? [
            { label: "Catégorie", value: modal.row.categorie },
            { label: "Description", value: modal.row.description },
            { label: "Lieu", value: `${modal.row.quartier}, ${modal.row.ville}` },
            { label: "Coordonnées", value: `${modal.row.lat}, ${modal.row.lng}` },
            { label: "Date", value: modal.row.date },
            { label: "Statut", value: <StatusPill status={modal.row.statut} /> },
            { label: "Photo", value: <img src={modal.row.photo} alt="" className="w-40 rounded-md" /> },
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
    case "overview": return "Vue d'ensemble — Signalements";
    case "all": return "Tous les signalements";
    case "map": return "Carte interactive des signalements";
    case "EN_ATTENTE": return "Signalements en attente";
    case "EN_COURS": return "Signalements en cours";
    case "RESOLU": return "Signalements résolus";
    default: return "Signalements";
  }
}
