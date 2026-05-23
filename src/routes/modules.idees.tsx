import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lightbulb, Check, X, Clock, TrendingUp } from "lucide-react";
import { ModuleLayout } from "@/components/ModuleLayout";
import { StatusPill } from "@/components/module-bits";
import { KpiCard, SectionCard, DonutBreakdown } from "@/components/dashboard";
import { idees } from "@/lib/mock-data";
import { getAuth } from "@/lib/auth";

export const Route = createFileRoute("/modules/idees")({
  head: () => ({ meta: [{ title: "Idées Citoyennes — CUY" }] }),
  component: Page,
});

function Page() {
  const navigate = useNavigate();
  useEffect(() => { if (!getAuth()) navigate({ to: "/login" }); }, [navigate]);

  const [tab, setTab] = useState<"all" | "EN_ATTENTE" | "VALIDE" | "REJETE">("all");
  const filtered = idees.filter((i) => (tab === "all" ? true : i.statut === tab));
  const count = (st: string) => idees.filter((i) => i.statut === st).length;
  const tauxValidation = Math.round((count("VALIDE") / Math.max(1, idees.length)) * 100);

  return (
    <ModuleLayout
      title="Idées Citoyennes"
      description="Pipeline de modération des propositions des citoyens."
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Propositions" value={idees.length} delta={15} icon={<Lightbulb className="h-5 w-5" />} tone="primary" />
        <KpiCard label="En attente" value={count("EN_ATTENTE")} hint="à modérer" icon={<Clock className="h-5 w-5" />} tone="warning" />
        <KpiCard label="Validées" value={count("VALIDE")} icon={<Check className="h-5 w-5" />} />
        <KpiCard label="Taux validation" value={`${tauxValidation}%`} delta={6} icon={<TrendingUp className="h-5 w-5" />} tone="info" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        <SectionCard title="Répartition par statut" className="lg:col-span-2">
          <DonutBreakdown data={[
            { label: "En attente", value: count("EN_ATTENTE"), color: "#f59e0b" },
            { label: "Validées", value: count("VALIDE") },
            { label: "Rejetées", value: count("REJETE"), color: "#ef4444" },
          ]} />
        </SectionCard>
        <SectionCard title="À traiter en priorité" subtitle={`${count("EN_ATTENTE")} idées en attente`}>
          <div className="space-y-3">
            {idees.filter((i) => i.statut === "EN_ATTENTE").slice(0, 4).map((i) => (
              <div key={i.id} className="flex items-start gap-2 text-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium line-clamp-1">{i.titre}</p>
                  <p className="text-xs text-muted-foreground">Par {i.auteur} · {i.date}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold">Propositions ({filtered.length})</h2>
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          {[
            { k: "all", l: "Toutes" },
            { k: "EN_ATTENTE", l: "En attente" },
            { k: "VALIDE", l: "Validées" },
            { k: "REJETE", l: "Rejetées" },
          ].map((t) => (
            <button key={t.k} onClick={() => setTab(t.k as any)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md ${tab === t.k ? "bg-card shadow-sm" : "text-muted-foreground"}`}>
              {t.l}
            </button>
          ))}
        </div>
      </div>

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
                <button className="flex-1 text-xs font-medium px-3 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 inline-flex items-center justify-center gap-1.5">
                  <Check className="h-3.5 w-3.5" /> Valider
                </button>
                <button className="flex-1 text-xs font-medium px-3 py-2 rounded-md border border-border hover:bg-muted inline-flex items-center justify-center gap-1.5">
                  <X className="h-3.5 w-3.5" /> Rejeter
                </button>
              </div>
            )}
          </article>
        ))}
      </div>
    </ModuleLayout>
  );
}
