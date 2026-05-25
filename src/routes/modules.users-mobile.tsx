import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Plus, Smartphone, UserCheck, UserX, TrendingUp, Phone, AlertTriangle } from "lucide-react";
import { ModuleLayout } from "@/components/ModuleLayout";
import { ActiveDot } from "@/components/module-bits";
import { KpiCard, SectionCard, AreaTrend, BarsCompare } from "@/components/dashboard";
import { EntityModal, RowActions, type ModalField } from "@/components/EntityModal";
import { Button } from "@/components/ui/button";
import { usersMobile as seed } from "@/lib/mock-data";
import { getAuth } from "@/lib/auth";

export const Route = createFileRoute("/modules/users-mobile")({
  head: () => ({ meta: [{ title: "Utilisateurs Mobile — CUY" }] }),
  component: Page,
});

const SIGNUPS = [
  { label: "S1", value: 24 }, { label: "S2", value: 31 }, { label: "S3", value: 28 },
  { label: "S4", value: 42 }, { label: "S5", value: 39 }, { label: "S6", value: 55 }, { label: "S7", value: 61 },
];
const ARRONDS = [
  { label: "Ydé 1", value: 142 }, { label: "Ydé 2", value: 98 }, { label: "Ydé 3", value: 76 },
  { label: "Ydé 4", value: 124 }, { label: "Ydé 5", value: 88 }, { label: "Ydé 6", value: 67 }, { label: "Ydé 7", value: 52 },
];

type User = (typeof seed)[number];

const FIELDS: ModalField[] = [
  { name: "nom", label: "Nom complet", placeholder: "Samuel Biya" },
  { name: "telephone", label: "Téléphone", type: "tel", required: true, placeholder: "+237 690 ..." },
];

function Page() {
  const navigate = useNavigate();
  useEffect(() => { if (!getAuth()) navigate({ to: "/login" }); }, [navigate]);

  const [rows, setRows] = useState<User[]>(seed);
  const [section, setSection] = useState("overview");
  const [modal, setModal] = useState<{ mode: "info" | "add" | "edit" | "confirm"; row?: User } | null>(null);
  const [draft, setDraft] = useState<Record<string, any>>({});

  const actives = rows.filter((u) => u.est_active).length;
  const inactifs = rows.length - actives;
  const incomplets = rows.filter((u) => !u.nom).length;
  const tauxActif = Math.round((actives / Math.max(1, rows.length)) * 100);

  const counts = { all: rows.length, active: actives, inactive: inactifs, incomplete: incomplets };

  const filtered = useMemo(() => {
    if (section === "active") return rows.filter((u) => u.est_active);
    if (section === "inactive") return rows.filter((u) => !u.est_active);
    if (section === "incomplete") return rows.filter((u) => !u.nom);
    return rows;
  }, [rows, section]);

  const openAdd = () => { setDraft({}); setModal({ mode: "add" }); };
  const openEdit = (row: User) => { setDraft(row); setModal({ mode: "edit", row }); };
  const openInfo = (row: User) => setModal({ mode: "info", row });
  const openDelete = (row: User) => setModal({ mode: "confirm", row });
  const toggle = (row: User) => setRows((r) => r.map((u) => u.id === row.id ? { ...u, est_active: !u.est_active } : u));
  const close = () => setModal(null);
  const submit = () => {
    if (!modal) return;
    if (modal.mode === "add") {
      const id = Math.max(0, ...rows.map((r) => r.id)) + 1;
      setRows((r) => [{ id, est_active: true, role: "USER", nom: null, ...draft } as User, ...r]);
    } else if (modal.mode === "edit" && modal.row) {
      setRows((r) => r.map((u) => u.id === modal.row!.id ? { ...u, ...draft } as User : u));
    } else if (modal.mode === "confirm" && modal.row) {
      setRows((r) => r.filter((u) => u.id !== modal.row!.id));
    }
    close();
  };

  return (
    <ModuleLayout
      moduleKey="users-mobile" activeSection={section} onSectionChange={setSection} sectionCounts={counts}
      title={titleFor(section)} description="Citoyens inscrits via l'application mobile CUY."
      actions={section !== "overview" ? <Button size="sm" onClick={openAdd}><Plus className="h-4 w-4 mr-1.5" /> Nouveau citoyen</Button> : undefined}
    >
      {section === "overview" && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <KpiCard label="Citoyens inscrits" value="647" delta={18} hint="depuis le lancement" icon={<Smartphone className="h-5 w-5" />} tone="primary" />
            <KpiCard label="Actifs (30j)" value={actives} delta={9} icon={<UserCheck className="h-5 w-5" />} />
            <KpiCard label="Taux d'activité" value={`${tauxActif}%`} delta={3} icon={<TrendingUp className="h-5 w-5" />} tone="info" />
            <KpiCard label="Désactivés" value={inactifs} icon={<UserX className="h-5 w-5" />} tone="warning" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            <SectionCard title="Nouvelles inscriptions" subtitle="7 dernières semaines" className="lg:col-span-2">
              <AreaTrend data={SIGNUPS} />
            </SectionCard>
            <SectionCard title="Par arrondissement" subtitle="Yaoundé · 7 arrondissements" className="lg:col-span-3">
              <BarsCompare data={ARRONDS} />
            </SectionCard>
          </div>
        </>
      )}

      {section !== "overview" && (
        <SectionCard title={titleFor(section)} subtitle={`${filtered.length} citoyen${filtered.length>1?"s":""}`}>
          <div className="-mx-5 -mb-5 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-muted-foreground">
                <tr className="text-left">
                  <th className="px-5 py-3 font-medium">Citoyen</th>
                  <th className="px-5 py-3 font-medium">Téléphone</th>
                  <th className="px-5 py-3 font-medium">Statut</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} className="border-t border-border hover:bg-muted/30">
                    <td className="px-5 py-3.5 font-medium">
                      {u.nom || <span className="text-muted-foreground italic inline-flex items-center gap-1.5"><AlertTriangle className="h-3.5 w-3.5 text-amber-500" />Profil incomplet</span>}
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{u.telephone}</span>
                    </td>
                    <td className="px-5 py-3.5"><ActiveDot active={u.est_active} /></td>
                    <td className="px-5 py-3.5 text-right">
                      <RowActions onInfo={() => openInfo(u)} onEdit={() => openEdit(u)} onToggle={() => toggle(u)} isActive={u.est_active} onDelete={() => openDelete(u)} />
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={4} className="px-5 py-10 text-center text-sm text-muted-foreground">Aucun citoyen.</td></tr>}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}

      {modal && (
        <EntityModal
          open mode={modal.mode}
          title={modal.mode === "info" ? (modal.row?.nom || "Profil incomplet") : modal.mode === "add" ? "Nouveau citoyen" : modal.mode === "edit" ? "Modifier le citoyen" : "Supprimer ?"}
          description={modal.mode === "confirm" ? `Le citoyen ${modal.row?.nom ?? modal.row?.telephone} sera supprimé.` : undefined}
          destructive={modal.mode === "confirm"}
          fields={FIELDS} data={draft} onChange={(k, v) => setDraft((d) => ({ ...d, [k]: v }))}
          infoRows={modal.mode === "info" && modal.row ? [
            { label: "Nom", value: modal.row.nom ?? "—" },
            { label: "Téléphone", value: modal.row.telephone },
            { label: "Rôle", value: modal.row.role },
            { label: "Statut", value: <ActiveDot active={modal.row.est_active} /> },
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
    case "overview": return "Vue d'ensemble — Utilisateurs Mobile";
    case "all": return "Annuaire citoyens";
    case "active": return "Citoyens actifs";
    case "inactive": return "Citoyens désactivés";
    case "incomplete": return "Profils incomplets";
    default: return "Utilisateurs Mobile";
  }
}
