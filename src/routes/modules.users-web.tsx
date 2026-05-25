import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Plus, Users, UserCheck, UserX, ShieldCheck, Activity } from "lucide-react";
import { ModuleLayout } from "@/components/ModuleLayout";
import { StatusPill, ActiveDot } from "@/components/module-bits";
import { KpiCard, SectionCard, AreaTrend, DonutBreakdown, ActivityItem } from "@/components/dashboard";
import { EntityModal, RowActions, type ModalField } from "@/components/EntityModal";
import { Button } from "@/components/ui/button";
import { usersWeb as seed } from "@/lib/mock-data";
import { getAuth } from "@/lib/auth";

export const Route = createFileRoute("/modules/users-web")({
  head: () => ({ meta: [{ title: "Utilisateurs Web — CUY" }] }),
  component: Page,
});

const TREND = [
  { label: "Lun", value: 2 }, { label: "Mar", value: 3 }, { label: "Mer", value: 1 },
  { label: "Jeu", value: 4 }, { label: "Ven", value: 2 }, { label: "Sam", value: 0 }, { label: "Dim", value: 1 },
];

type User = (typeof seed)[number];

const FIELDS: ModalField[] = [
  { name: "nom", label: "Nom complet", required: true, placeholder: "Marie Mballa" },
  { name: "email", label: "Email", type: "email", required: true, placeholder: "marie@cuy.cm" },
  { name: "telephone", label: "Téléphone", type: "tel", placeholder: "+237 690 ..." },
  { name: "role", label: "Rôle", type: "select", required: true, options: [
    { value: "ADMIN", label: "Administrateur" }, { value: "MODERATEUR", label: "Modérateur" },
  ]},
];

function Page() {
  const navigate = useNavigate();
  useEffect(() => { if (!getAuth()) navigate({ to: "/login" }); }, [navigate]);

  const [rows, setRows] = useState<User[]>(seed);
  const [section, setSection] = useState("overview");
  const [modal, setModal] = useState<{ mode: "info" | "add" | "edit" | "confirm"; row?: User } | null>(null);
  const [draft, setDraft] = useState<Record<string, any>>({});

  const actives = rows.filter((u) => u.is_active).length;
  const admins = rows.filter((u) => u.role === "ADMIN").length;
  const mods = rows.filter((u) => u.role === "MODERATEUR").length;
  const inactifs = rows.length - actives;

  const counts = { all: rows.length, ADMIN: admins, MODERATEUR: mods, inactive: inactifs };

  const filtered = useMemo(() => {
    if (section === "all") return rows;
    if (section === "inactive") return rows.filter((u) => !u.is_active);
    if (section === "ADMIN" || section === "MODERATEUR") return rows.filter((u) => u.role === section);
    return rows;
  }, [rows, section]);

  const openAdd = () => { setDraft({ role: "ADMIN" }); setModal({ mode: "add" }); };
  const openEdit = (row: User) => { setDraft(row); setModal({ mode: "edit", row }); };
  const openInfo = (row: User) => setModal({ mode: "info", row });
  const openDelete = (row: User) => setModal({ mode: "confirm", row });
  const toggle = (row: User) => setRows((r) => r.map((u) => u.id === row.id ? { ...u, is_active: !u.is_active } : u));
  const close = () => setModal(null);

  const submit = () => {
    if (!modal) return;
    if (modal.mode === "add") {
      const id = Math.max(0, ...rows.map((r) => r.id)) + 1;
      setRows((r) => [{ id, is_active: true, ...draft } as User, ...r]);
    } else if (modal.mode === "edit" && modal.row) {
      setRows((r) => r.map((u) => u.id === modal.row!.id ? { ...u, ...draft } as User : u));
    } else if (modal.mode === "confirm" && modal.row) {
      setRows((r) => r.filter((u) => u.id !== modal.row!.id));
    }
    close();
  };

  return (
    <ModuleLayout
      moduleKey="users-web" activeSection={section} onSectionChange={setSection} sectionCounts={counts}
      title={titleFor(section)} description="Administrateurs et modérateurs de la plateforme CUY."
      actions={section !== "overview" && section !== "activity" ? (
        <Button size="sm" onClick={openAdd}><Plus className="h-4 w-4 mr-1.5" /> Nouveau compte</Button>
      ) : undefined}
    >
      {section === "overview" && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <KpiCard label="Total comptes" value={rows.length} delta={12} hint="vs. mois dernier" icon={<Users className="h-5 w-5" />} tone="primary" />
            <KpiCard label="Actifs" value={actives} delta={5} icon={<UserCheck className="h-5 w-5" />} />
            <KpiCard label="Administrateurs" value={admins} hint="accès complet" icon={<ShieldCheck className="h-5 w-5" />} />
            <KpiCard label="Désactivés" value={inactifs} delta={-2} icon={<UserX className="h-5 w-5" />} tone="warning" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <SectionCard title="Nouvelles inscriptions" subtitle="7 derniers jours" className="lg:col-span-2">
              <AreaTrend data={TREND} />
            </SectionCard>
            <SectionCard title="Répartition des rôles">
              <DonutBreakdown data={[{ label: "Administrateurs", value: admins }, { label: "Modérateurs", value: mods }]} />
            </SectionCard>
          </div>
        </>
      )}

      {section === "activity" && (
        <SectionCard title="Activité récente" subtitle="Dernières actions des administrateurs">
          <ActivityItem icon={<ShieldCheck className="h-4 w-4" />} title="Marie Mballa a validé 3 signalements" time="il y a 2 h" />
          <ActivityItem icon={<UserCheck className="h-4 w-4" />} title="Jean Eboa s'est connecté" description="Depuis 196.x.x.x — Yaoundé" time="il y a 4 h" />
          <ActivityItem icon={<Plus className="h-4 w-4" />} title="Paul Atangana a publié une actualité" description="Travaux d'asphaltage à Bastos" time="hier" />
          <ActivityItem icon={<Activity className="h-4 w-4" />} title="Aïcha Ngono a été désactivée" time="il y a 2 j" />
        </SectionCard>
      )}

      {(section === "all" || section === "ADMIN" || section === "MODERATEUR" || section === "inactive") && (
        <SectionCard title={titleFor(section)} subtitle={`${filtered.length} compte${filtered.length>1?"s":""}`}>
          <div className="-mx-5 -mb-5 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-muted-foreground">
                <tr className="text-left">
                  <th className="px-5 py-3 font-medium">Utilisateur</th>
                  <th className="px-5 py-3 font-medium">Téléphone</th>
                  <th className="px-5 py-3 font-medium">Rôle</th>
                  <th className="px-5 py-3 font-medium">Statut</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} className="border-t border-border hover:bg-muted/30">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-primary-glow text-primary-foreground flex items-center justify-center text-xs font-semibold">
                          {u.nom.split(" ").map((n) => n[0]).slice(0,2).join("")}
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
                      <RowActions onInfo={() => openInfo(u)} onEdit={() => openEdit(u)} onToggle={() => toggle(u)} isActive={u.is_active} onDelete={() => openDelete(u)} />
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-muted-foreground">Aucun compte dans cette section.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}

      {modal && (
        <EntityModal
          open mode={modal.mode}
          title={modal.mode === "add" ? "Nouveau compte" : modal.mode === "edit" ? "Modifier le compte" : modal.mode === "info" ? modal.row?.nom : "Supprimer ce compte ?"}
          description={modal.mode === "confirm" ? `Le compte de ${modal.row?.nom} sera définitivement supprimé.` : undefined}
          destructive={modal.mode === "confirm"}
          fields={FIELDS} data={draft} onChange={(k, v) => setDraft((d) => ({ ...d, [k]: v }))}
          infoRows={modal.mode === "info" && modal.row ? [
            { label: "Nom", value: modal.row.nom },
            { label: "Email", value: modal.row.email },
            { label: "Téléphone", value: modal.row.telephone },
            { label: "Rôle", value: <StatusPill status={modal.row.role} /> },
            { label: "Statut", value: <ActiveDot active={modal.row.is_active} /> },
          ] : undefined}
          onClose={close} onSubmit={submit}
          submitLabel={modal.mode === "confirm" ? "Supprimer" : undefined}
        />
      )}
    </ModuleLayout>
  );
}

function titleFor(s: string) {
  switch (s) {
    case "overview": return "Vue d'ensemble — Utilisateurs Web";
    case "all": return "Tous les comptes";
    case "ADMIN": return "Administrateurs";
    case "MODERATEUR": return "Modérateurs";
    case "inactive": return "Comptes désactivés";
    case "activity": return "Activité récente";
    default: return "Utilisateurs Web";
  }
}
