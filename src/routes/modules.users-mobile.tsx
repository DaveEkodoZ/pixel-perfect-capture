import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Smartphone, UserCheck, UserX, TrendingUp, Phone, Search } from "lucide-react";
import { ModuleLayout } from "@/components/ModuleLayout";
import { ActiveDot } from "@/components/module-bits";
import { KpiCard, SectionCard, AreaTrend, BarsCompare } from "@/components/dashboard";
import { Input } from "@/components/ui/input";
import { usersMobile } from "@/lib/mock-data";
import { getAuth } from "@/lib/auth";

export const Route = createFileRoute("/modules/users-mobile")({
  head: () => ({ meta: [{ title: "Utilisateurs Mobile — CUY" }] }),
  component: Page,
});

const SIGNUPS = [
  { label: "S1", value: 24 },
  { label: "S2", value: 31 },
  { label: "S3", value: 28 },
  { label: "S4", value: 42 },
  { label: "S5", value: 39 },
  { label: "S6", value: 55 },
  { label: "S7", value: 61 },
];

const ARRONDS = [
  { label: "Yaoundé 1", value: 142 },
  { label: "Yaoundé 2", value: 98 },
  { label: "Yaoundé 3", value: 76 },
  { label: "Yaoundé 4", value: 124 },
  { label: "Yaoundé 5", value: 88 },
  { label: "Yaoundé 6", value: 67 },
  { label: "Yaoundé 7", value: 52 },
];

function Page() {
  const navigate = useNavigate();
  useEffect(() => { if (!getAuth()) navigate({ to: "/login" }); }, [navigate]);

  const [tab, setTab] = useState<"all" | "active" | "inactive">("all");
  const filtered = usersMobile.filter((u) =>
    tab === "all" ? true : tab === "active" ? u.est_active : !u.est_active
  );
  const actives = usersMobile.filter((u) => u.est_active).length;
  const tauxActif = Math.round((actives / usersMobile.length) * 100);

  return (
    <ModuleLayout
      title="Utilisateurs Mobile"
      description="Citoyens inscrits via l'application mobile CUY."
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Citoyens inscrits" value="647" delta={18} hint="depuis le lancement" icon={<Smartphone className="h-5 w-5" />} tone="primary" />
        <KpiCard label="Actifs (30j)" value={actives} delta={9} icon={<UserCheck className="h-5 w-5" />} />
        <KpiCard label="Taux d'activité" value={`${tauxActif}%`} delta={3} icon={<TrendingUp className="h-5 w-5" />} tone="info" />
        <KpiCard label="Désactivés" value={usersMobile.length - actives} icon={<UserX className="h-5 w-5" />} tone="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-6">
        <SectionCard title="Nouvelles inscriptions" subtitle="7 dernières semaines" className="lg:col-span-2">
          <AreaTrend data={SIGNUPS} />
        </SectionCard>
        <SectionCard title="Répartition par arrondissement" subtitle="Yaoundé · 7 arrondissements" className="lg:col-span-3">
          <BarsCompare data={ARRONDS} />
        </SectionCard>
      </div>

      <SectionCard
        title="Annuaire citoyens"
        subtitle={`${usersMobile.length} comptes affichés`}
        action={
          <div className="flex items-center gap-2">
            <div className="hidden md:flex gap-1 rounded-lg bg-muted p-1">
              {[{ k: "all", l: "Tous" }, { k: "active", l: "Actifs" }, { k: "inactive", l: "Inactifs" }].map((t) => (
                <button
                  key={t.k}
                  onClick={() => setTab(t.k as any)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    tab === t.k ? "bg-card shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  {t.l}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Rechercher..." className="pl-8 h-8 w-44 text-xs" />
            </div>
          </div>
        }
      >
        <div className="-mx-5 -mb-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-muted-foreground">
              <tr className="text-left">
                <th className="px-5 py-3 font-medium">Citoyen</th>
                <th className="px-5 py-3 font-medium">Téléphone</th>
                <th className="px-5 py-3 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-5 py-3.5 font-medium">
                    {u.nom || <span className="text-muted-foreground italic">Profil incomplet</span>}
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground inline-flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5" />{u.telephone}
                  </td>
                  <td className="px-5 py-3.5"><ActiveDot active={u.est_active} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </ModuleLayout>
  );
}
