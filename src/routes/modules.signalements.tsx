import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AlertTriangle, MapPin, Calendar } from "lucide-react";
import { ModuleLayout } from "@/components/ModuleLayout";
import { StatCard, StatusPill } from "@/components/module-bits";
import { signalements } from "@/lib/mock-data";
import { getAuth } from "@/lib/auth";

export const Route = createFileRoute("/modules/signalements")({
  head: () => ({ meta: [{ title: "Signalements — CUY" }] }),
  component: Page,
});

const TABS = ["all", "EN_ATTENTE", "EN_COURS", "RESOLU"] as const;
type Tab = (typeof TABS)[number];

function Page() {
  const navigate = useNavigate();
  useEffect(() => { if (!getAuth()) navigate({ to: "/login" }); }, [navigate]);

  const [tab, setTab] = useState<Tab>("all");
  const filtered = signalements.filter((s) => (tab === "all" ? true : s.statut === tab));

  const count = (st: string) => signalements.filter((s) => s.statut === st).length;

  return (
    <ModuleLayout
      title="Signalements"
      description="Traitez les signalements géolocalisés remontés par les citoyens."
      tabs={[
        { key: "all", label: `Tous (${signalements.length})`, active: tab === "all", onClick: () => setTab("all") },
        { key: "EN_ATTENTE", label: `En attente (${count("EN_ATTENTE")})`, active: tab === "EN_ATTENTE", onClick: () => setTab("EN_ATTENTE") },
        { key: "EN_COURS", label: `En cours (${count("EN_COURS")})`, active: tab === "EN_COURS", onClick: () => setTab("EN_COURS") },
        { key: "RESOLU", label: `Résolus (${count("RESOLU")})`, active: tab === "RESOLU", onClick: () => setTab("RESOLU") },
      ]}
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total" value={signalements.length} icon={<AlertTriangle className="h-5 w-5" />} />
        <StatCard label="En attente" value={count("EN_ATTENTE")} />
        <StatCard label="En cours" value={count("EN_COURS")} />
        <StatCard label="Résolus" value={count("RESOLU")} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((s) => (
          <article key={s.id} className="rounded-xl border border-border bg-card overflow-hidden flex">
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
