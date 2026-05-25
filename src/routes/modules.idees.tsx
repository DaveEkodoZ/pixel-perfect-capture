import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Lightbulb, Check, X, Clock, TrendingUp, Plus } from "lucide-react";
import { ModuleLayout } from "@/components/ModuleLayout";
import { StatusPill } from "@/components/module-bits";
import { KpiCard, SectionCard, DonutBreakdown } from "@/components/dashboard";
import { EntityModal, RowActions, type ModalField } from "@/components/EntityModal";
import { Button } from "@/components/ui/button";
import { idees as seed } from "@/lib/mock-data";
import { getAuth } from "@/lib/auth";

export const Route = createFileRoute("/modules/idees")({
  head: () => ({ meta: [{ title: "Idées Citoyennes — CUY" }] }),
  component: Page,
});

type Idee = (typeof seed)[number];

const FIELDS: ModalField[] = [
  { name: "titre", label: "Titre", required: true },
  { name: "description", label: "Description", type: "textarea", required: true },
  { name: "auteur", label: "Auteur", required: true },
  { name: "statut", label: "Statut", type: "select", required: true, options: [
    { value: "EN_ATTENTE", label: "En attente" }, { value: "VALIDE", label: "Validée" }, { value: "REJETE", label: "Rejetée" }] },
];

function Page() {
  const navigate = useNavigate();
  useEffect(() => { if (!getAuth()) navigate({ to: "/login" }); }, [navigate]);

  const [rows, setRows] = useState<Idee[]>(seed);
  const [section, setSection] = useState("overview");
  const [modal, setModal] = useState<{ mode: "info" | "add" | "edit" | "confirm"; row?: Idee } | null>(null);
  const [draft, setDraft] = useState<Record<string, any>>({});

  const count = (st: string) => rows.filter((i) => i.statut === st).length;
  const tauxValidation = rows.length ? Math.round((count("VALIDE") / rows.length) * 100) : 0;

  const counts = { all: rows.length, EN_ATTENTE: count("EN_ATTENTE"), VALIDE: count("VALIDE"), REJETE: count("REJETE") };
  const filtered = useMemo(() => section === "all" || section === "overview" ? rows : rows.filter((i) => i.statut === section), [rows, section]);

  const setStatut = (row: Idee, statut: string) => setRows((r) => r.map((i) => i.id === row.id ? { ...i, statut } : i));

  const openAdd = () => { setDraft({ statut: "EN_ATTENTE" }); setModal({ mode: "add" }); };
  const openEdit = (row: Idee) => { setDraft(row); setModal({ mode: "edit", row }); };
  const openInfo = (row: Idee) => setModal({ mode: "info", row });
  const openDelete = (row: Idee) => setModal({ mode: "confirm", row });
  const close = () => setModal(null);
  const submit = () => {
    if (!modal) return;
    if (modal.mode === "add") {
      const id = Math.max(0, ...rows.map((r) => r.id)) + 1;
      const date = new Date().toISOString().slice(0, 10);
      setRows((r) => [{ id, date, ...draft } as Idee, ...r]);
    } else if (modal.mode === "edit" && modal.row) {
      setRows((r) => r.map((i) => i.id === modal.row!.id ? { ...i, ...draft } as Idee : i));
    } else if (modal.mode === "confirm" && modal.row) {
      setRows((r) => r.filter((i) => i.id !== modal.row!.id));
    }
    close();
  };

  return (
    <ModuleLayout
      moduleKey="idees" activeSection={section} onSectionChange={setSection} sectionCounts={counts}
      title={titleFor(section)} description="Pipeline de modération des propositions citoyennes."
      actions={section !== "overview" ? <Button size="sm" onClick={openAdd}><Plus className="h-4 w-4 mr-1.5" /> Nouvelle idée</Button> : undefined}
    >
      {section === "overview" && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <KpiCard label="Propositions" value={rows.length} delta={15} icon={<Lightbulb className="h-5 w-5" />} tone="primary" />
            <KpiCard label="En attente" value={count("EN_ATTENTE")} hint="à modérer" icon={<Clock className="h-5 w-5" />} tone="warning" />
            <KpiCard label="Validées" value={count("VALIDE")} icon={<Check className="h-5 w-5" />} />
            <KpiCard label="Taux validation" value={`${tauxValidation}%`} delta={6} icon={<TrendingUp className="h-5 w-5" />} tone="info" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <SectionCard title="Répartition par statut" className="lg:col-span-2">
              <DonutBreakdown data={[
                { label: "En attente", value: count("EN_ATTENTE"), color: "#f59e0b" },
                { label: "Validées", value: count("VALIDE") },
                { label: "Rejetées", value: count("REJETE"), color: "#ef4444" },
              ]} />
            </SectionCard>
            <SectionCard title="À traiter en priorité" subtitle={`${count("EN_ATTENTE")} idées en attente`}>
              <div className="space-y-3">
                {rows.filter((i) => i.statut === "EN_ATTENTE").slice(0, 4).map((i) => (
                  <button key={i.id} onClick={() => openInfo(i)} className="w-full flex items-start gap-2 text-sm text-left hover:bg-muted/40 -mx-2 px-2 py-1.5 rounded-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium line-clamp-1">{i.titre}</p>
                      <p className="text-xs text-muted-foreground">Par {i.auteur} · {i.date}</p>
                    </div>
                  </button>
                ))}
              </div>
            </SectionCard>
          </div>
        </>
      )}

      {section !== "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((i) => (
            <article key={i.id} className="rounded-xl border border-border bg-card p-6 hover:border-primary/40 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-primary-glow text-primary-foreground flex items-center justify-center shrink-0">
                  <Lightbulb className="h-5 w-5" />
                </div>
                <StatusPill status={i.statut} />
              </div>
              <h3 className="mt-4 font-bold text-lg leading-snug">{i.titre}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground line-clamp-3">{i.description}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-3">
                <span>Par <span className="font-medium text-foreground">{i.auteur}</span></span>
                <span>{i.date}</span>
              </div>

              {i.statut === "EN_ATTENTE" && (
                <div className="mt-4 flex gap-2">
                  <button onClick={() => setStatut(i, "VALIDE")} className="flex-1 text-xs font-medium px-3 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 inline-flex items-center justify-center gap-1.5">
                    <Check className="h-3.5 w-3.5" /> Valider
                  </button>
                  <button onClick={() => setStatut(i, "REJETE")} className="flex-1 text-xs font-medium px-3 py-2 rounded-md border border-border hover:bg-muted inline-flex items-center justify-center gap-1.5">
                    <X className="h-3.5 w-3.5" /> Rejeter
                  </button>
                </div>
              )}

              <div className="mt-3 -mb-1">
                <RowActions onInfo={() => openInfo(i)} onEdit={() => openEdit(i)} onDelete={() => openDelete(i)} />
              </div>
            </article>
          ))}
          {filtered.length === 0 && <div className="col-span-full text-center text-sm text-muted-foreground py-12">Aucune proposition.</div>}
        </div>
      )}

      {modal && (
        <EntityModal
          open mode={modal.mode}
          title={modal.mode === "info" ? modal.row?.titre : modal.mode === "add" ? "Nouvelle idée" : modal.mode === "edit" ? "Modifier l'idée" : "Supprimer cette idée ?"}
          destructive={modal.mode === "confirm"}
          fields={FIELDS} data={draft} onChange={(k, v) => setDraft((d) => ({ ...d, [k]: v }))}
          infoRows={modal.mode === "info" && modal.row ? [
            { label: "Titre", value: modal.row.titre },
            { label: "Description", value: modal.row.description },
            { label: "Auteur", value: modal.row.auteur },
            { label: "Date", value: modal.row.date },
            { label: "Statut", value: <StatusPill status={modal.row.statut} /> },
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
    case "overview": return "Vue d'ensemble — Idées";
    case "all": return "Toutes les propositions";
    case "EN_ATTENTE": return "Idées en attente";
    case "VALIDE": return "Idées validées";
    case "REJETE": return "Idées rejetées";
    default: return "Idées Citoyennes";
  }
}
