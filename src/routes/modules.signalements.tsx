import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AlertTriangle, MapPin, Calendar, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { ModuleLayout } from "@/components/ModuleLayout";
import { StatusPill } from "@/components/module-bits";
import { KpiCard, SectionCard, DonutBreakdown, AreaTrend } from "@/components/dashboard";
import { signalements } from "@/lib/mock-data";
import { getAuth } from "@/lib/auth";

export const Route = createFileRoute("/modules/signalements")({
  head: () => ({ meta: [{ title: "Signalements — CUY" }] }),
  component: Page,
});

const MONTHS = [
  { label: "Jan", value: 18 },
  { label: "Fév", value: 22 },
  { label: "Mar", value: 31 },
  { label: "Avr", value: 28 },
  { label: "Mai", value: 42 },
];

function Page() {
  const navigate = useNavigate();
  useEffect(() => { if (!getAuth()) navigate({ to: "/login" }); }, [navigate]);

  const [tab, setTab] = useState<"all" | "EN_ATTENTE" | "EN_COURS" | "RESOLU">("all");
  const filtered = signalements.filter((s) => (tab === "all" ? true : s.statut === tab));
  const count = (st: string) => signalements.filter((s) => s.statut === st).length;
  const taux = Math.round((count("RESOLU") / signalements.length) * 100);

  const categories = Array.from(
    signalements.reduce((m, s) => m.set(s.categorie, (m.get(s.categorie) ?? 0) + 1), new Map<string, number>())
  ).map(([label, value]) => ({ label, value }));

  return (
    <ModuleLayout
      title="Signalements"
      description="Suivi opérationnel des signalements géolocalisés."
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Total signalements" value={signalements.length} delta={9} icon={<AlertTriangle className="h-5 w-5" />} tone="primary" />
        <KpiCard label="En attente" value={count("EN_ATTENTE")} icon={<Clock className="h-5 w-5" />} tone="warning" />
        <KpiCard label="En cours" value={count("EN_COURS")} icon={<Loader2 className="h-5 w-5" />} tone="info" />
        <KpiCard label="Taux résolution" value={`${taux}%`} delta={4} hint={`${count("RESOLU")} résolus`} icon={<CheckCircle2 className="h-5 w-5" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-6">
        <SectionCard title="Évolution mensuelle" subtitle="Signalements reçus" className="lg:col-span-3">
          <AreaTrend data={MONTHS} />
        </SectionCard>
        <SectionCard title="Par catégorie" className="lg:col-span-2">
          <DonutBreakdown data={categories} />
        </SectionCard>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold">Dossiers ({filtered.length})</h2>
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          {[
            { k: "all", l: "Tous" },
            { k: "EN_ATTENTE", l: "En attente" },
            { k: "EN_COURS", l: "En cours" },
            { k: "RESOLU", l: "Résolus" },
          ].map((t) => (
            <button key={t.k} onClick={() => setTab(t.k as any)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md ${tab === t.k ? "bg-card shadow-sm" : "text-muted-foreground"}`}>
              {t.l}
            </button>
          ))}
        </div>
      </div>

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
              <div className="mt-4 flex gap-2">
                <button className="text-xs font-medium px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:opacity-90">
                  Traiter
                </button>
                <button className="text-xs font-medium px-3 py-1.5 rounded-md border border-border hover:bg-muted">
                  Détails
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </ModuleLayout>
  );
}
