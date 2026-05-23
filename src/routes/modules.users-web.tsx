import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Users, UserCheck, UserX, ShieldCheck, MoreHorizontal } from "lucide-react";
import { ModuleLayout } from "@/components/ModuleLayout";
import { StatusPill, ActiveDot } from "@/components/module-bits";
import { KpiCard, SectionCard, AreaTrend, DonutBreakdown, ActivityItem } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { usersWeb } from "@/lib/mock-data";
import { getAuth } from "@/lib/auth";

export const Route = createFileRoute("/modules/users-web")({
  head: () => ({ meta: [{ title: "Utilisateurs Web — CUY" }] }),
  component: Page,
});

const TREND = [
  { label: "Lun", value: 2 },
  { label: "Mar", value: 3 },
  { label: "Mer", value: 1 },
  { label: "Jeu", value: 4 },
  { label: "Ven", value: 2 },
  { label: "Sam", value: 0 },
  { label: "Dim", value: 1 },
];

function Page() {
  const navigate = useNavigate();
  useEffect(() => { if (!getAuth()) navigate({ to: "/login" }); }, [navigate]);

  const [tab, setTab] = useState<"all" | "active" | "inactive">("all");
  const filtered = usersWeb.filter((u) =>
    tab === "all" ? true : tab === "active" ? u.is_active : !u.is_active
  );
  const actives = usersWeb.filter((u) => u.is_active).length;
  const admins = usersWeb.filter((u) => u.role === "ADMIN").length;
  const mods = usersWeb.filter((u) => u.role === "MODERATEUR").length;

  return (
    <ModuleLayout
      title="Utilisateurs Web"
      description="Administrateurs et modérateurs de la plateforme CUY."
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Total comptes" value={usersWeb.length} delta={12} hint="vs. mois dernier" icon={<Users className="h-5 w-5" />} tone="primary" />
        <KpiCard label="Actifs" value={actives} delta={5} hint="connectés ce mois" icon={<UserCheck className="h-5 w-5" />} />
        <KpiCard label="Administrateurs" value={admins} hint="accès complet" icon={<ShieldCheck className="h-5 w-5" />} />
        <KpiCard label="Désactivés" value={usersWeb.length - actives} delta={-2} icon={<UserX className="h-5 w-5" />} tone="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        <SectionCard title="Nouvelles inscriptions" subtitle="7 derniers jours" className="lg:col-span-2">
          <AreaTrend data={TREND} />
        </SectionCard>
        <SectionCard title="Répartition des rôles">
          <DonutBreakdown data={[
            { label: "Administrateurs", value: admins },
            { label: "Modérateurs", value: mods },
          ]} />
        </SectionCard>
      </div>

      <SectionCard
        title="Liste des comptes"
        subtitle={`${usersWeb.length} comptes au total`}
        action={
          <div className="flex items-center gap-2">
            <div className="hidden md:flex gap-1 rounded-lg bg-muted p-1">
              {[
                { k: "all", l: "Tous" },
                { k: "active", l: "Actifs" },
                { k: "inactive", l: "Inactifs" },
              ].map((t) => (
                <button
                  key={t.k}
                  onClick={() => setTab(t.k as any)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    tab === t.k ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.l}
                </button>
              ))}
            </div>
            <Button size="sm"><Plus className="h-4 w-4 mr-1.5" /> Inviter</Button>
          </div>
        }
      >
        <div className="-mx-5 -mb-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-muted-foreground">
              <tr className="text-left">
                <th className="px-5 py-3 font-medium">Utilisateur</th>
                <th className="px-5 py-3 font-medium">Téléphone</th>
                <th className="px-5 py-3 font-medium">Rôle</th>
                <th className="px-5 py-3 font-medium">Statut</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-primary-glow text-primary-foreground flex items-center justify-center text-xs font-semibold">
                        {u.nom.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                      </div>
                      <div>
                        <div className="font-medium">{u.nom}</div>
                        <div className="text-xs text-muted-foreground">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">{u.telephone}</td>
                  <td className="px-5 py-3.5"><StatusPill status={u.role} /></td>
                  <td className="px-5 py-3.5"><ActiveDot active={u.is_active} /></td>
                  <td className="px-5 py-3.5 text-right">
                    <button className="p-1.5 rounded-md hover:bg-muted"><MoreHorizontal className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard title="Activité récente" subtitle="Dernières actions des administrateurs" className="mt-6">
        <ActivityItem icon={<ShieldCheck className="h-4 w-4" />} title="Marie Mballa a validé 3 signalements" time="il y a 2 h" />
        <ActivityItem icon={<UserCheck className="h-4 w-4" />} title="Jean Eboa s'est connecté" description="Depuis 196.x.x.x — Yaoundé" time="il y a 4 h" />
        <ActivityItem icon={<Plus className="h-4 w-4" />} title="Paul Atangana a publié une actualité" description="Travaux d'asphaltage à Bastos" time="hier" />
      </SectionCard>
    </ModuleLayout>
  );
}
