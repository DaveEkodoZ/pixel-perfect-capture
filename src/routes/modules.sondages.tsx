import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Vote, Users } from "lucide-react";
import { ModuleLayout } from "@/components/ModuleLayout";
import { StatCard, StatusPill } from "@/components/module-bits";
import { Button } from "@/components/ui/button";
import { sondages } from "@/lib/mock-data";
import { getAuth } from "@/lib/auth";

export const Route = createFileRoute("/modules/sondages")({
  head: () => ({ meta: [{ title: "Sondages — CUY" }] }),
  component: Page,
});

function Page() {
  const navigate = useNavigate();
  useEffect(() => { if (!getAuth()) navigate({ to: "/login" }); }, [navigate]);

  const [tab, setTab] = useState<"all" | "ACTIF" | "TERMINE">("all");
  const filtered = sondages.filter((s) => (tab === "all" ? true : s.statut === tab));
  const totalVotes = sondages.reduce((a, s) => a + s.total, 0);

  return (
    <ModuleLayout
      title="Sondages"
      description="Créez des sondages et suivez les votes des citoyens en temps réel."
      tabs={[
        { key: "all", label: `Tous (${sondages.length})`, active: tab === "all", onClick: () => setTab("all") },
        { key: "ACTIF", label: "Actifs", active: tab === "ACTIF", onClick: () => setTab("ACTIF") },
        { key: "TERMINE", label: "Terminés", active: tab === "TERMINE", onClick: () => setTab("TERMINE") },
      ]}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Sondages" value={sondages.length} icon={<Vote className="h-5 w-5" />} />
        <StatCard label="Actifs" value={sondages.filter(s => s.statut === "ACTIF").length} />
        <StatCard label="Votes recueillis" value={totalVotes.toLocaleString()} icon={<Users className="h-5 w-5" />} />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-muted-foreground">Liste des sondages</h2>
        <Button size="sm"><Plus className="h-4 w-4 mr-1.5" /> Nouveau sondage</Button>
      </div>

      <div className="space-y-4">
        {filtered.map((s) => (
          <div key={s.id} className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold">{s.question}</h3>
                <p className="text-sm text-muted-foreground mt-1">{s.total.toLocaleString()} votes au total</p>
              </div>
              <StatusPill status={s.statut} />
            </div>

            <div className="mt-5 space-y-3">
              {s.options.map((o) => {
                const pct = s.total === 0 ? 0 : Math.round((o.votes / s.total) * 100);
                return (
                  <div key={o.id}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium">{o.libelle}</span>
                      <span className="text-muted-foreground">{o.votes} · {pct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </ModuleLayout>
  );
}
