import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Users,
  Smartphone,
  Newspaper,
  AlertTriangle,
  Lightbulb,
  Vote,
  Image as ImageIcon,
  Activity,
  TrendingUp,
  Eye,
  Heart,
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
} from "lucide-react";
import { ModuleLayout } from "@/components/ModuleLayout";
import {
  KpiCard,
  SectionCard,
  AreaTrend,
  BarsCompare,
  DonutBreakdown,
  ActivityItem,
} from "@/components/dashboard";
import {
  usersWeb,
  usersMobile,
  posts,
  stories,
  sondages,
  signalements,
  idees,
  mediaLibrary,
} from "@/lib/mock-data";
import { getAuth } from "@/lib/auth";

export const Route = createFileRoute("/modules/statistiques")({
  head: () => ({ meta: [{ title: "Statistiques BI — CUY" }] }),
  component: Page,
});

// ------- Mock series partagées -------
const MONTHS6 = ["Déc", "Jan", "Fév", "Mar", "Avr", "Mai"];

const traffic = MONTHS6.map((m, i) => ({
  label: m,
  value: 1200 + i * 320 + (i % 2 ? 150 : 0),
}));

const newUsers = MONTHS6.map((m, i) => ({
  label: m,
  value: 45 + i * 22 + (i === 4 ? 30 : 0),
}));

const engagementSerie = MONTHS6.map((m, i) => ({
  label: m,
  value: 4.2 + i * 0.4 + (i % 2 ? 0.3 : -0.1),
}));

const signalementsMois = MONTHS6.map((m, i) => ({
  label: m,
  value: 18 + i * 4 + (i === 5 ? 8 : 0),
}));

const topContenu = posts.map((p) => ({
  label: p.titre.slice(0, 18) + "…",
  value: p.nb_vues,
}));

const repartitionModule = [
  { label: "Posts", value: posts.length * 18 },
  { label: "Stories", value: stories.length * 9 },
  { label: "Sondages", value: sondages.reduce((a, s) => a + s.total, 0) },
  { label: "Signalements", value: signalements.length * 12 },
  { label: "Idées", value: idees.length * 7 },
];

const arrondissements = [
  { label: "Yaoundé I", value: 124 },
  { label: "Yaoundé II", value: 98 },
  { label: "Yaoundé III", value: 142 },
  { label: "Yaoundé IV", value: 87 },
  { label: "Yaoundé V", value: 76 },
  { label: "Yaoundé VI", value: 65 },
  { label: "Yaoundé VII", value: 55 },
];

const repartitionStatuts = [
  { label: "En attente", value: signalements.filter((s) => s.statut === "EN_ATTENTE").length, color: "#f59e0b" },
  { label: "En cours", value: signalements.filter((s) => s.statut === "EN_COURS").length, color: "#3b82f6" },
  { label: "Résolu", value: signalements.filter((s) => s.statut === "RESOLU").length, color: "#10b981" },
];

const repartitionIdees = [
  { label: "En attente", value: idees.filter((i) => i.statut === "EN_ATTENTE").length, color: "#f59e0b" },
  { label: "Validées", value: idees.filter((i) => i.statut === "VALIDE").length, color: "#10b981" },
  { label: "Rejetées", value: idees.filter((i) => i.statut === "REJETE").length, color: "#ef4444" },
];

function Page() {
  const navigate = useNavigate();
  useEffect(() => {
    if (!getAuth()) navigate({ to: "/login" });
  }, [navigate]);

  const [section, setSection] = useState("overview");

  const totalVues = posts.reduce((a, p) => a + p.nb_vues, 0) + stories.reduce((a, s) => a + s.nb_vues, 0);
  const totalLikes = posts.reduce((a, p) => a + p.nb_likes, 0) + stories.reduce((a, s) => a + s.nb_likes, 0);
  const totalUsers = usersWeb.length + 647; // mobile mock
  const totalVotes = sondages.reduce((a, s) => a + s.total, 0);
  const tauxResolution = signalements.length
    ? Math.round((signalements.filter((s) => s.statut === "RESOLU").length / signalements.length) * 100)
    : 0;

  return (
    <ModuleLayout
      moduleKey="statistiques"
      activeSection={section}
      onSectionChange={setSection}
      title={titleFor(section)}
      description="Tableau de bord BI consolidant toutes les activités de la plateforme."
    >
      {section === "overview" && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <KpiCard label="Utilisateurs totaux" value={totalUsers.toLocaleString()} delta={18} hint={`${usersWeb.length} web · 647 mobile`} icon={<Users className="h-5 w-5" />} tone="primary" />
            <KpiCard label="Vues cumulées" value={totalVues.toLocaleString()} delta={24} icon={<Eye className="h-5 w-5" />} />
            <KpiCard label="Engagements" value={totalLikes.toLocaleString()} delta={11} hint="likes & interactions" icon={<Heart className="h-5 w-5" />} tone="info" />
            <KpiCard label="Taux résolution" value={`${tauxResolution}%`} delta={4} hint="signalements" icon={<CheckCircle2 className="h-5 w-5" />} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-5">
            <SectionCard title="Trafic global (6 mois)" subtitle="Pages vues toutes plateformes" className="lg:col-span-3">
              <AreaTrend data={traffic} height={240} />
            </SectionCard>
            <SectionCard title="Activité par module" className="lg:col-span-2">
              <DonutBreakdown data={repartitionModule} />
            </SectionCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <SectionCard title="Nouveaux utilisateurs / mois">
              <BarsCompare data={newUsers} height={220} />
            </SectionCard>
            <SectionCard title="Activité récente">
              <ActivityItem icon={<AlertTriangle className="h-4 w-4" />} title="Nouveau signalement — Bastos" description="Voirie · Nid-de-poule" time="il y a 2 min" />
              <ActivityItem icon={<Newspaper className="h-4 w-4" />} title="Publication programmée" description="Travaux d'asphaltage à Bastos" time="il y a 18 min" />
              <ActivityItem icon={<Vote className="h-4 w-4" />} title="Sondage clôturé" description="Service de bus — 856 votes" time="il y a 1 h" />
              <ActivityItem icon={<Users className="h-4 w-4" />} title="12 nouveaux citoyens" description="Inscription mobile" time="il y a 3 h" />
              <ActivityItem icon={<Lightbulb className="h-4 w-4" />} title="Idée validée" description="Marchés nocturnes mensuels" time="il y a 5 h" />
            </SectionCard>
          </div>
        </>
      )}

      {section === "engagement" && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <KpiCard label="Vues" value={totalVues.toLocaleString()} delta={24} icon={<Eye className="h-5 w-5" />} tone="primary" />
            <KpiCard label="Likes" value={totalLikes.toLocaleString()} delta={11} icon={<Heart className="h-5 w-5" />} />
            <KpiCard label="Votes" value={totalVotes.toLocaleString()} delta={6} icon={<Vote className="h-5 w-5" />} tone="info" />
            <KpiCard label="Taux d'engagement" value={`${totalVues ? Math.round((totalLikes / totalVues) * 1000) / 10 : 0}%`} delta={2} icon={<Activity className="h-5 w-5" />} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <SectionCard title="Évolution de l'engagement"><AreaTrend data={engagementSerie} height={240} /></SectionCard>
            <SectionCard title="Top contenus"><BarsCompare data={topContenu} height={240} /></SectionCard>
          </div>
        </>
      )}

      {section === "content" && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <KpiCard label="Actualités" value={posts.length} hint={`${posts.filter(p => p.est_active).length} publiées`} icon={<Newspaper className="h-5 w-5" />} tone="primary" />
            <KpiCard label="Stories" value={stories.length} hint={`${stories.filter(s => s.est_active).length} en ligne`} icon={<ImageIcon className="h-5 w-5" />} />
            <KpiCard label="Médias" value={mediaLibrary.length} hint="bibliothèque" icon={<ImageIcon className="h-5 w-5" />} tone="info" />
            <KpiCard label="Sondages actifs" value={sondages.filter(s => s.statut === "ACTIF").length} icon={<Vote className="h-5 w-5" />} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <SectionCard title="Top publications"><BarsCompare data={topContenu} height={240} /></SectionCard>
            <SectionCard title="Performance médias">
              <DonutBreakdown data={[
                { label: "Utilisés", value: mediaLibrary.filter(m => m.usage !== "—").length, color: "#10b981" },
                { label: "Disponibles", value: mediaLibrary.filter(m => m.usage === "—").length, color: "#94a3b8" },
              ]} />
            </SectionCard>
          </div>
        </>
      )}

      {section === "operations" && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <KpiCard label="Signalements" value={signalements.length} delta={9} icon={<AlertTriangle className="h-5 w-5" />} tone="warning" />
            <KpiCard label="En attente" value={signalements.filter(s => s.statut === "EN_ATTENTE").length} icon={<Clock className="h-5 w-5" />} />
            <KpiCard label="En cours" value={signalements.filter(s => s.statut === "EN_COURS").length} icon={<Loader2 className="h-5 w-5" />} tone="info" />
            <KpiCard label="Idées citoyennes" value={idees.length} hint={`${idees.filter(i => i.statut === "VALIDE").length} validées`} icon={<Lightbulb className="h-5 w-5" />} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
            <SectionCard title="Signalements / mois"><AreaTrend data={signalementsMois} height={220} /></SectionCard>
            <SectionCard title="Répartition statuts"><DonutBreakdown data={repartitionStatuts} /></SectionCard>
          </div>
          <SectionCard title="Idées citoyennes — décisions">
            <DonutBreakdown data={repartitionIdees} />
          </SectionCard>
        </>
      )}

      {section === "audience" && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <KpiCard label="Citoyens mobile" value="647" delta={18} icon={<Smartphone className="h-5 w-5" />} tone="primary" />
            <KpiCard label="Admins web" value={usersWeb.length} hint={`${usersWeb.filter(u => u.is_active).length} actifs`} icon={<Users className="h-5 w-5" />} />
            <KpiCard label="Profils incomplets" value={usersMobile.filter(u => !u.nom).length} icon={<AlertTriangle className="h-5 w-5" />} tone="warning" />
            <KpiCard label="Rétention 30j" value="78%" delta={3} icon={<TrendingUp className="h-5 w-5" />} tone="info" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <SectionCard title="Citoyens par arrondissement"><BarsCompare data={arrondissements} height={260} /></SectionCard>
            <SectionCard title="Nouveaux inscrits / mois"><AreaTrend data={newUsers} height={260} /></SectionCard>
          </div>
        </>
      )}

      {section === "trends" && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <KpiCard label="Croissance utilisateurs" value="+18%" delta={18} icon={<TrendingUp className="h-5 w-5" />} tone="primary" />
            <KpiCard label="Croissance vues" value="+24%" delta={24} icon={<Eye className="h-5 w-5" />} />
            <KpiCard label="Croissance signalements" value="+9%" delta={9} icon={<AlertTriangle className="h-5 w-5" />} tone="warning" />
            <KpiCard label="Croissance engagement" value="+11%" delta={11} icon={<Heart className="h-5 w-5" />} tone="info" />
          </div>
          <div className="space-y-5">
            <SectionCard title="Trafic global"><AreaTrend data={traffic} height={220} /></SectionCard>
            <SectionCard title="Signalements opérationnels"><AreaTrend data={signalementsMois} height={220} /></SectionCard>
          </div>
        </>
      )}

      {section === "distribution" && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
            <SectionCard title="Activité par module"><DonutBreakdown data={repartitionModule} /></SectionCard>
            <SectionCard title="Signalements par statut"><DonutBreakdown data={repartitionStatuts} /></SectionCard>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <SectionCard title="Idées citoyennes"><DonutBreakdown data={repartitionIdees} /></SectionCard>
            <SectionCard title="Signalements par catégorie">
              <DonutBreakdown
                data={Array.from(
                  signalements.reduce((m, s) => m.set(s.categorie, (m.get(s.categorie) ?? 0) + 1), new Map<string, number>())
                ).map(([label, value]) => ({ label, value }))}
              />
            </SectionCard>
          </div>
          <div className="mt-5">
            <SectionCard title="Géographie — arrondissements"><BarsCompare data={arrondissements} height={240} /></SectionCard>
          </div>
        </>
      )}
    </ModuleLayout>
  );
}

function titleFor(s: string) {
  switch (s) {
    case "overview": return "Vue exécutive — Statistiques BI";
    case "engagement": return "Indicateurs d'engagement";
    case "content": return "Performance du contenu";
    case "operations": return "Opérations citoyennes";
    case "audience": return "Analyse de l'audience";
    case "trends": return "Tendances & croissance";
    case "distribution": return "Répartitions & catégories";
    default: return "Statistiques";
  }
}

// Silence unused import warning for MapPin (kept for potential future use)
void MapPin;
