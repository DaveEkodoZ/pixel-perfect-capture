import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Vote, Users, Activity, CheckCircle2 } from "lucide-react";
import { ModuleLayout } from "@/components/ModuleLayout";
import { StatusPill } from "@/components/module-bits";
import { KpiCard, SectionCard, BarsCompare } from "@/components/dashboard";
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
  const actifs = sondages.filter((s) => s.statut === "ACTIF").length;
  const termines = sondages.filter((s) => s.statut === "TERMINE").length;
  const moyenne = Math.round(totalVotes / sondages.length);
  const perSondage = sondages.map((s, i) => ({ label: `Sondage ${i + 1}`, value: s.total }));

  return (
    <ModuleLayout
      title="Sondages"
      description="Suivez la participation citoyenne et les résultats en temps réel."
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Sondages" value={sondages.length} hint={`${actifs} actifs`} icon={<Vote className="h-5 w-5" />} tone="primary" />
        <KpiCard label="Votes recueillis" value={totalVotes.toLocaleString()} delta={17} icon={<Users className="h-5 w-5" />} />
        <KpiCard label="Participation moy." value={moyenne.toLocaleString()} hint="par sondage" icon={<Activity className="h-5 w-5" />} tone="info" />
        <KpiCard label="Terminés" value={termines} icon={<CheckCircle2 className="h-5 w-5" />} />
      </div>

      <SectionCard title="Participation par sondage" subtitle="Total des votes" className="mb-6">
        <BarsCompare data={perSondage} />
      </SectionCard>

      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          {[{ k: "all", l: "Tous" }, { k: "ACTIF", l: "Actifs" }, { k: "TERMINE", l: "Terminés" }].map((t) => (
            <button key={t.k} onClick={() => setTab(t.k as any)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md ${tab === t.k ? "bg-card shadow-sm" : "text-muted-foreground"}`}>
              {t.l}
            </button>
          ))}
        </div>
        <Button size="sm"><Plus className="h-4 w-4 mr-1.5" /> Nouveau sondage</Button>
      </div>

      <div className="space-y-4">
        {filtered.map((s) => {
          const winner = [...s.options].sort((a, b) => b.votes - a.votes)[0];
          return (
            <div key={s.id} className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold">{s.question}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {s.total.toLocaleString()} votes · En tête : <span className="text-foreground font-medium">{winner.libelle}</span>
                  </p>
                </div>
                <StatusPill status={s.statut} />
              </div>

              <div className="mt-5 space-y-3">
                {s.options.map((o) => {
                  const pct = s.total === 0 ? 0 : Math.round((o.votes / s.total) * 100);
                  const isWin = o.id === winner.id;
                  return (
                    <div key={o.id}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className={`font-medium ${isWin ? "text-primary" : ""}`}>{o.libelle}</span>
                        <span className="text-muted-foreground">{o.votes} · {pct}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${isWin ? "bg-gradient-to-r from-primary to-primary-glow" : "bg-muted-foreground/30"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </ModuleLayout>
  );
}
