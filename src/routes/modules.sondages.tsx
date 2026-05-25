import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Plus, Vote, Users, Activity, CheckCircle2 } from "lucide-react";
import { ModuleLayout } from "@/components/ModuleLayout";
import { StatusPill } from "@/components/module-bits";
import { KpiCard, SectionCard, BarsCompare } from "@/components/dashboard";
import { EntityModal, RowActions, type ModalField } from "@/components/EntityModal";
import { Button } from "@/components/ui/button";
import { sondages as seed } from "@/lib/mock-data";
import { getAuth } from "@/lib/auth";

export const Route = createFileRoute("/modules/sondages")({
  head: () => ({ meta: [{ title: "Sondages — CUY" }] }),
  component: Page,
});

type Sondage = (typeof seed)[number];

const FIELDS: ModalField[] = [
  { name: "question", label: "Question", required: true, placeholder: "Quel projet prioriser ?" },
  { name: "statut", label: "Statut", type: "select", required: true, options: [
    { value: "ACTIF", label: "Actif" }, { value: "TERMINE", label: "Terminé" }] },
  { name: "optionsText", label: "Options (une par ligne)", type: "textarea", required: true, placeholder: "Option A\nOption B\nOption C" },
];

function Page() {
  const navigate = useNavigate();
  useEffect(() => { if (!getAuth()) navigate({ to: "/login" }); }, [navigate]);

  const [rows, setRows] = useState<Sondage[]>(seed);
  const [section, setSection] = useState("overview");
  const [modal, setModal] = useState<{ mode: "info" | "add" | "edit" | "confirm"; row?: Sondage } | null>(null);
  const [draft, setDraft] = useState<Record<string, any>>({});

  const actifs = rows.filter((s) => s.statut === "ACTIF").length;
  const termines = rows.filter((s) => s.statut === "TERMINE").length;
  const totalVotes = rows.reduce((a, s) => a + s.total, 0);
  const moyenne = rows.length ? Math.round(totalVotes / rows.length) : 0;

  const counts = { all: rows.length, ACTIF: actifs, TERMINE: termines };
  const filtered = useMemo(() => {
    if (section === "ACTIF" || section === "TERMINE") return rows.filter((s) => s.statut === section);
    return rows;
  }, [rows, section]);

  const perSondage = rows.map((s, i) => ({ label: `S${i + 1}`, value: s.total }));

  const openAdd = () => { setDraft({ statut: "ACTIF", optionsText: "" }); setModal({ mode: "add" }); };
  const openEdit = (row: Sondage) => { setDraft({ ...row, optionsText: row.options.map((o) => o.libelle).join("\n") }); setModal({ mode: "edit", row }); };
  const openInfo = (row: Sondage) => setModal({ mode: "info", row });
  const openDelete = (row: Sondage) => setModal({ mode: "confirm", row });
  const toggle = (row: Sondage) => setRows((r) => r.map((s) => s.id === row.id ? { ...s, statut: s.statut === "ACTIF" ? "TERMINE" : "ACTIF" } : s));
  const close = () => setModal(null);
  const submit = () => {
    if (!modal) return;
    const parseOpts = (t: string) => (t || "").split("\n").map((l) => l.trim()).filter(Boolean).map((libelle, i) => ({ id: i + 1, libelle, votes: 0 }));
    if (modal.mode === "add") {
      const id = Math.max(0, ...rows.map((r) => r.id)) + 1;
      const options = parseOpts(draft.optionsText);
      setRows((r) => [{ id, question: draft.question, statut: draft.statut, total: 0, options }, ...r]);
    } else if (modal.mode === "edit" && modal.row) {
      const options = parseOpts(draft.optionsText);
      setRows((r) => r.map((s) => s.id === modal.row!.id ? { ...s, question: draft.question, statut: draft.statut, options } : s));
    } else if (modal.mode === "confirm" && modal.row) {
      setRows((r) => r.filter((s) => s.id !== modal.row!.id));
    }
    close();
  };

  return (
    <ModuleLayout
      moduleKey="sondages" activeSection={section} onSectionChange={setSection} sectionCounts={counts}
      title={titleFor(section)} description="Participation citoyenne et résultats en temps réel."
      actions={section !== "overview" && section !== "stats" ? <Button size="sm" onClick={openAdd}><Plus className="h-4 w-4 mr-1.5" /> Nouveau sondage</Button> : undefined}
    >
      {section === "overview" && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <KpiCard label="Sondages" value={rows.length} hint={`${actifs} actifs`} icon={<Vote className="h-5 w-5" />} tone="primary" />
            <KpiCard label="Votes recueillis" value={totalVotes.toLocaleString()} delta={17} icon={<Users className="h-5 w-5" />} />
            <KpiCard label="Moyenne / sondage" value={moyenne.toLocaleString()} icon={<Activity className="h-5 w-5" />} tone="info" />
            <KpiCard label="Terminés" value={termines} icon={<CheckCircle2 className="h-5 w-5" />} />
          </div>
          <SectionCard title="Participation par sondage" subtitle="Total des votes"><BarsCompare data={perSondage} /></SectionCard>
        </>
      )}

      {section === "stats" && (
        <SectionCard title="Comparatif global"><BarsCompare data={perSondage} height={300} /></SectionCard>
      )}

      {(section === "all" || section === "ACTIF" || section === "TERMINE") && (
        <div className="space-y-4">
          {filtered.map((s) => {
            const winner = [...s.options].sort((a, b) => b.votes - a.votes)[0];
            return (
              <div key={s.id} className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold">{s.question}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {s.total.toLocaleString()} votes{winner && <> · En tête : <span className="text-foreground font-medium">{winner.libelle}</span></>}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusPill status={s.statut} />
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {s.options.map((o) => {
                    const pct = s.total === 0 ? 0 : Math.round((o.votes / s.total) * 100);
                    const isWin = winner && o.id === winner.id;
                    return (
                      <div key={o.id}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className={`font-medium ${isWin ? "text-primary" : ""}`}>{o.libelle}</span>
                          <span className="text-muted-foreground">{o.votes} · {pct}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div className={`h-full rounded-full transition-all ${isWin ? "bg-gradient-to-r from-primary to-primary-glow" : "bg-muted-foreground/30"}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 pt-3 border-t border-border">
                  <RowActions onInfo={() => openInfo(s)} onEdit={() => openEdit(s)} onToggle={() => toggle(s)} isActive={s.statut === "ACTIF"} onDelete={() => openDelete(s)} />
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && <div className="text-center text-sm text-muted-foreground py-12">Aucun sondage.</div>}
        </div>
      )}

      {modal && (
        <EntityModal
          open mode={modal.mode}
          title={modal.mode === "info" ? modal.row?.question : modal.mode === "add" ? "Nouveau sondage" : modal.mode === "edit" ? "Modifier le sondage" : "Supprimer ce sondage ?"}
          destructive={modal.mode === "confirm"}
          fields={FIELDS} data={draft} onChange={(k, v) => setDraft((d) => ({ ...d, [k]: v }))}
          infoRows={modal.mode === "info" && modal.row ? [
            { label: "Question", value: modal.row.question },
            { label: "Statut", value: <StatusPill status={modal.row.statut} /> },
            { label: "Votes", value: modal.row.total.toLocaleString() },
            { label: "Options", value: <ul className="list-disc pl-4 space-y-1">{modal.row.options.map((o) => <li key={o.id}>{o.libelle} — {o.votes}</li>)}</ul> },
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
    case "overview": return "Vue d'ensemble — Sondages";
    case "all": return "Tous les sondages";
    case "ACTIF": return "Sondages actifs";
    case "TERMINE": return "Sondages terminés";
    case "stats": return "Résultats détaillés";
    default: return "Sondages";
  }
}
