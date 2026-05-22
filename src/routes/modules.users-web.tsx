import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Users, UserCheck, UserX, MoreHorizontal } from "lucide-react";
import { ModuleLayout } from "@/components/ModuleLayout";
import { StatCard, StatusPill, ActiveDot } from "@/components/module-bits";
import { Button } from "@/components/ui/button";
import { usersWeb } from "@/lib/mock-data";
import { getAuth } from "@/lib/auth";

export const Route = createFileRoute("/modules/users-web")({
  head: () => ({ meta: [{ title: "Utilisateurs Web — CUY" }] }),
  component: Page,
});

function Page() {
  const navigate = useNavigate();
  useEffect(() => { if (!getAuth()) navigate({ to: "/login" }); }, [navigate]);

  const [tab, setTab] = useState<"all" | "active" | "inactive">("all");
  const filtered = usersWeb.filter((u) =>
    tab === "all" ? true : tab === "active" ? u.is_active : !u.is_active
  );
  const actives = usersWeb.filter((u) => u.is_active).length;

  return (
    <ModuleLayout
      title="Utilisateurs Web"
      description="Gérez les administrateurs et modérateurs de la plateforme."
      tabs={[
        { key: "all", label: `Tous (${usersWeb.length})`, active: tab === "all", onClick: () => setTab("all") },
        { key: "active", label: `Actifs (${actives})`, active: tab === "active", onClick: () => setTab("active") },
        { key: "inactive", label: `Inactifs (${usersWeb.length - actives})`, active: tab === "inactive", onClick: () => setTab("inactive") },
      ]}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total comptes" value={usersWeb.length} icon={<Users className="h-5 w-5" />} />
        <StatCard label="Actifs" value={actives} icon={<UserCheck className="h-5 w-5" />} />
        <StatCard label="Désactivés" value={usersWeb.length - actives} icon={<UserX className="h-5 w-5" />} />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-muted-foreground">Liste des utilisateurs</h2>
        <Button size="sm"><Plus className="h-4 w-4 mr-1.5" /> Nouvel administrateur</Button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr className="text-left">
              <th className="px-5 py-3 font-medium">Utilisateur</th>
              <th className="px-5 py-3 font-medium">Email</th>
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
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-primary-glow text-primary-foreground flex items-center justify-center text-sm font-semibold">
                      {u.nom.split(" ").map(n => n[0]).slice(0, 2).join("")}
                    </div>
                    <span className="font-medium">{u.nom}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-muted-foreground">{u.email}</td>
                <td className="px-5 py-3.5 text-muted-foreground">{u.telephone}</td>
                <td className="px-5 py-3.5"><StatusPill status={u.role} /></td>
                <td className="px-5 py-3.5"><ActiveDot active={u.is_active} /></td>
                <td className="px-5 py-3.5 text-right">
                  <button className="p-1.5 rounded hover:bg-muted"><MoreHorizontal className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ModuleLayout>
  );
}
