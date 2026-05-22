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
  | "idees";

export interface ModuleInfo {
  key: ModuleKey;
  path: string;
  title: string;
  short: string;
  description: string;
  icon: LucideIcon;
}

export const MODULES: ModuleInfo[] = [
  {
    key: "users-web",
    path: "/modules/users-web",
    title: "Utilisateurs Web",
    short: "Admins",
    description: "Gérez les comptes administrateurs de la plateforme web.",
    icon: Users,
  },
  {
    key: "users-mobile",
    path: "/modules/users-mobile",
    title: "Utilisateurs Mobile",
    short: "Citoyens",
    description: "Citoyens inscrits via l'application mobile CUY.",
    icon: Smartphone,
  },
  {
    key: "posts",
    path: "/modules/posts",
    title: "Posts Actualité",
    short: "Actualités",
    description: "Publiez et modérez les actualités de la communauté.",
    icon: Newspaper,
  },
  {
    key: "stories",
    path: "/modules/stories",
    title: "Stories",
    short: "Stories",
    description: "Diffusez des stories éphémères aux citoyens.",
    icon: ImageIcon,
  },
  {
    key: "sondages",
    path: "/modules/sondages",
    title: "Sondages",
    short: "Sondages",
    description: "Créez des sondages et analysez les votes en direct.",
    icon: Vote,
  },
  {
    key: "signalements",
    path: "/modules/signalements",
    title: "Signalements",
    short: "Signalements",
    description: "Traitez les signalements géolocalisés des citoyens.",
    icon: AlertTriangle,
  },
  {
    key: "idees",
    path: "/modules/idees",
    title: "Idées Citoyennes",
    short: "Idées",
    description: "Validez ou rejetez les idées proposées par les citoyens.",
    icon: Lightbulb,
  },
];

export const DASHBOARD_ITEM = {
  path: "/dashboard",
  title: "Tableau de bord",
  icon: LayoutDashboard,
};
