import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Smartphone, UserCheck, UserX, Phone } from "lucide-react";
import { ModuleLayout } from "@/components/ModuleLayout";
import { StatCard, ActiveDot } from "@/components/module-bits";
import { usersMobile } from "@/lib/mock-data";
import { getAuth } from "@/lib/auth";

export const Route = createFileRoute("/modules/users-mobile")({
  head: () => ({ meta: [{ title: "Utilisateurs Mobile — CUY" }] }),
  component: Page,
});

function Page() {
  const navigate = useNavigate();
  useEffect(() => { if (!getAuth()) navigate({ to: "/login" }); }, [navigate]);

  const [tab, setTab] = useState<"all" | "active" | "inactive">("all");
  const filtered = usersMobile.filter((u) =>
    tab === "all" ? true : tab === "active" ? u.est_active : !u.est_active
  );
  const actives = usersMobile.filter((u) => u.est_active).length;

  return (
    <ModuleLayout
      title="Utilisateurs Mobile"
      description="Citoyens inscrits via l'application mobile CUY."
      tabs={[
        { key: "all", label: `Tous (${usersMobile.length})`, active: tab === "all", onClick: () => setTab("all") },
        { key: "active", label: `Actifs (${actives})`, active: tab === "active", onClick: () => setTab("active") },
        { key: "inactive", label: `Inactifs (${usersMobile.length - actives})`, active: tab === "inactive", onClick: () => setTab("inactive") },
      ]}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Citoyens inscrits" value={usersMobile.length} icon={<Smartphone className="h-5 w-5" />} />
        <StatCard label="Actifs" value={actives} icon={<UserCheck className="h-5 w-5" />} />
        <StatCard label="Désactivés" value={usersMobile.length - actives} icon={<UserX className="h-5 w-5" />} />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr className="text-left">
              <th className="px-5 py-3 font-medium">Nom</th>
              <th className="px-5 py-3 font-medium">Téléphone</th>
              <th className="px-5 py-3 font-medium">Rôle</th>
              <th className="px-5 py-3 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-t border-border hover:bg-muted/30">
                <td className="px-5 py-3.5 font-medium">{u.nom || <span className="text-muted-foreground italic">Non renseigné</span>}</td>
                <td className="px-5 py-3.5 text-muted-foreground">
                  <span className="inline-flex items-center gap-2"><Phone className="h-3.5 w-3.5" />{u.telephone}</span>
                </td>
                <td className="px-5 py-3.5 text-muted-foreground">{u.role}</td>
                <td className="px-5 py-3.5"><ActiveDot active={u.est_active} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ModuleLayout>
  );
}
