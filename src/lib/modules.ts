import logoCuy from "@/assets/logo-cuy.png";
import {
  Users,
  Smartphone,
  Image as ImageIcon,
  Vote,
  AlertTriangle,
  Newspaper,
  Lightbulb,
  LayoutDashboard,
  LayoutGrid,
  ShieldCheck,
  UserCog,
  UserX,
  Activity,
  Eye,
  Archive,
  Play,
  PauseCircle,
  BarChart3,
  CheckCircle2,
  Loader2,
  Clock,
  Check,
  X,
  Map as MapIcon,
  Images,
  TrendingUp,
  PieChart,
  type LucideIcon,
} from "lucide-react";

export const LOGO = logoCuy;

export const BRAND = {
  name: "Communauté Urbaine de Yaoundé",
  short: "CUY",
  tagline: "Plateforme d'administration",
};

export type ModuleKey =
  | "users-web"
  | "users-mobile"
  | "stories"
  | "sondages"
  | "signalements"
  | "posts"
  | "idees"
  | "statistiques";

export interface ModuleSection {
  key: string;
  label: string;
  icon: LucideIcon;
}

export interface ModuleInfo {
  key: ModuleKey;
  path: string;
  title: string;
  short: string;
  description: string;
  icon: LucideIcon;
  sections: ModuleSection[];
}

export const MODULES: ModuleInfo[] = [
  {
    key: "users-web",
    path: "/modules/users-web",
    title: "Utilisateurs Web",
    short: "Admins",
    description: "Gérez les comptes administrateurs de la plateforme web.",
    icon: Users,
    sections: [
      { key: "overview", label: "Vue d'ensemble", icon: LayoutGrid },
      { key: "all", label: "Tous les comptes", icon: Users },
      { key: "ADMIN", label: "Administrateurs", icon: ShieldCheck },
      { key: "MODERATEUR", label: "Modérateurs", icon: UserCog },
      { key: "inactive", label: "Désactivés", icon: UserX },
      { key: "activity", label: "Activité récente", icon: Activity },
    ],
  },
  {
    key: "users-mobile",
    path: "/modules/users-mobile",
    title: "Utilisateurs Mobile",
    short: "Citoyens",
    description: "Citoyens inscrits via l'application mobile CUY.",
    icon: Smartphone,
    sections: [
      { key: "overview", label: "Vue d'ensemble", icon: LayoutGrid },
      { key: "all", label: "Annuaire", icon: Users },
      { key: "active", label: "Citoyens actifs", icon: CheckCircle2 },
      { key: "inactive", label: "Désactivés", icon: UserX },
      { key: "incomplete", label: "Profils incomplets", icon: AlertTriangle },
    ],
  },
  {
    key: "posts",
    path: "/modules/posts",
    title: "Posts Actualité",
    short: "Actualités",
    description: "Publiez et modérez les actualités de la communauté.",
    icon: Newspaper,
    sections: [
      { key: "overview", label: "Vue d'ensemble", icon: LayoutGrid },
      { key: "all", label: "Toutes les publications", icon: Newspaper },
      { key: "published", label: "Publiés", icon: Eye },
      { key: "archived", label: "Archivés", icon: Archive },
      { key: "stats", label: "Statistiques", icon: BarChart3 },
    ],
  },
  {
    key: "stories",
    path: "/modules/stories",
    title: "Stories",
    short: "Stories",
    description: "Diffusez des stories éphémères aux citoyens.",
    icon: ImageIcon,
    sections: [
      { key: "overview", label: "Vue d'ensemble", icon: LayoutGrid },
      { key: "all", label: "Toutes les stories", icon: ImageIcon },
      { key: "online", label: "En ligne", icon: Play },
      { key: "offline", label: "Hors ligne", icon: PauseCircle },
      { key: "stats", label: "Performances", icon: BarChart3 },
    ],
  },
  {
    key: "sondages",
    path: "/modules/sondages",
    title: "Sondages",
    short: "Sondages",
    description: "Créez des sondages et analysez les votes en direct.",
    icon: Vote,
    sections: [
      { key: "overview", label: "Vue d'ensemble", icon: LayoutGrid },
      { key: "all", label: "Tous les sondages", icon: Vote },
      { key: "ACTIF", label: "Actifs", icon: Play },
      { key: "TERMINE", label: "Terminés", icon: CheckCircle2 },
      { key: "stats", label: "Résultats", icon: BarChart3 },
    ],
  },
  {
    key: "signalements",
    path: "/modules/signalements",
    title: "Signalements",
    short: "Signalements",
    description: "Traitez les signalements géolocalisés des citoyens.",
    icon: AlertTriangle,
    sections: [
      { key: "overview", label: "Vue d'ensemble", icon: LayoutGrid },
      { key: "all", label: "Tous les dossiers", icon: AlertTriangle },
      { key: "EN_ATTENTE", label: "En attente", icon: Clock },
      { key: "EN_COURS", label: "En cours", icon: Loader2 },
      { key: "RESOLU", label: "Résolus", icon: CheckCircle2 },
    ],
  },
  {
    key: "idees",
    path: "/modules/idees",
    title: "Idées Citoyennes",
    short: "Idées",
    description: "Validez ou rejetez les idées proposées par les citoyens.",
    icon: Lightbulb,
    sections: [
      { key: "overview", label: "Vue d'ensemble", icon: LayoutGrid },
      { key: "all", label: "Toutes les idées", icon: Lightbulb },
      { key: "EN_ATTENTE", label: "En attente", icon: Clock },
      { key: "VALIDE", label: "Validées", icon: Check },
      { key: "REJETE", label: "Rejetées", icon: X },
    ],
  },
];

export const DASHBOARD_ITEM = {
  path: "/dashboard",
  title: "Tableau de bord",
  icon: LayoutDashboard,
};

export function getModule(key: ModuleKey): ModuleInfo {
  return MODULES.find((m) => m.key === key)!;
}
