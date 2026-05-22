import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lightbulb, Check, X, Clock } from "lucide-react";
import { ModuleLayout } from "@/components/ModuleLayout";
import { StatCard, StatusPill } from "@/components/module-bits";
import { idees } from "@/lib/mock-data";
import { getAuth } from "@/lib/auth";

export const Route = createFileRoute("/modules/idees")({
  head: () => ({ meta: [{ title: "Idées Citoyennes — CUY" }] }),
  component: Page,
});

const TABS = ["all", "EN_ATTENTE", "VALIDE", "REJETE"] as const;
type Tab = (typeof TABS)[number];

function Page() {
  const navigate = useNavigate();
  useEffect(() => { if (!getAuth()) navigate({ to: "/login" }); }, [navigate]);

  const [tab, setTab] = useState<Tab>("all");
  const filtered = idees.filter((i) => (tab === "all" ? true : i.statut === tab));
  const count = (st: string) => idees.filter((i) => i.statut === st).length;

  return (
    <ModuleLayout
      title="Idées Citoyennes"
      description="Examinez les propositions des citoyens et décidez de leur sort."
      tabs={[
        { key: "all", label: `Toutes (${idees.length})`, active: tab === "all", onClick: () => setTab("all") },
        { key: "EN_ATTENTE", label: `En attente (${count("EN_ATTENTE")})`, active: tab === "EN_ATTENTE", onClick: () => setTab("EN_ATTENTE") },
        { key: "VALIDE", label: `Validées (${count("VALIDE")})`, active: tab === "VALIDE", onClick: () => setTab("VALIDE") },
        { key: "REJETE", label: `Rejetées (${count("REJETE")})`, active: tab === "REJETE", onClick: () => setTab("REJETE") },
      ]}
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard label="Propositions" value={idees.length} icon={<Lightbulb className="h-5 w-5" />} />
        <StatCard label="En attente" value={count("EN_ATTENTE")} icon={<Clock className="h-5 w-5" />} />
        <StatCard label="Validées" value={count("VALIDE")} icon={<Check className="h-5 w-5" />} />
        <StatCard label="Rejetées" value={count("REJETE")} icon={<X className="h-5 w-5" />} />
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
