import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowRight, LogOut, Users, Smartphone, Newspaper, AlertTriangle, TrendingUp } from "lucide-react";
import { MODULES, LOGO, BRAND } from "@/lib/modules";
import { getAuth, logout } from "@/lib/auth";
import { KpiCard } from "@/components/dashboard";
import {
  usersWeb,
  usersMobile,
  posts,
  signalements,
  sondages,
  idees,
} from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Tableau de bord — CUY" },
      { name: "description", content: "Modules d'administration de la Communauté Urbaine de Yaoundé." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!getAuth()) navigate({ to: "/login" });
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  const enAttente =
    signalements.filter((s) => s.statut === "EN_ATTENTE").length +
    idees.filter((i) => i.statut === "EN_ATTENTE").length;

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b border-border bg-card sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={LOGO} alt="CUY" className="h-11 w-11 object-contain" />
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                République du Cameroun
              </div>
              <div className="font-bold text-foreground leading-tight">{BRAND.name}</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-xs">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-muted-foreground">Système opérationnel</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut className="h-4 w-4" /> Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-border relative overflow-hidden" style={{ background: "var(--gradient-soft)" }}>
        <div className="absolute inset-0 opacity-60"
             style={{ backgroundImage: "radial-gradient(circle at 80% 0%, color-mix(in oklab, var(--primary) 25%, transparent) 0%, transparent 50%)" }} />
        <div className="max-w-7xl mx-auto px-6 py-12 relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-card border border-border px-3 py-1 text-xs font-medium text-primary mb-4 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Espace administrateur
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Bonjour, <span className="text-primary">Administrateur</span>
          </h1>
          <p className="mt-3 text-muted-foreground max-w-2xl">
            Vue d'ensemble en temps réel de la plateforme citoyenne de Yaoundé.
          </p>

          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard label="Citoyens mobile" value="647" delta={18} icon={<Smartphone className="h-5 w-5" />} tone="primary" />
            <KpiCard label="Administrateurs" value={usersWeb.length} icon={<Users className="h-5 w-5" />} />
            <KpiCard label="Publications" value={posts.length} delta={9} icon={<Newspaper className="h-5 w-5" />} />
            <KpiCard label="En attente" value={enAttente} hint="à traiter" icon={<AlertTriangle className="h-5 w-5" />} tone="warning" />
          </div>
        </div>
      </section>

      {/* Module cards */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Modules de gestion</h2>
            <p className="text-sm text-muted-foreground mt-1">{MODULES.length} modules disponibles · Sélectionnez pour ouvrir le tableau de bord dédié</p>
          </div>
          <div className="hidden md:inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5 text-primary" /> Mises à jour temps réel
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {MODULES.map((m, i) => {
            const stats = moduleStats(m.key);
            return (
              <Link
                key={m.key}
                to={m.path}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:-translate-y-1 hover:shadow-xl"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-primary/5 group-hover:bg-primary/15 transition-colors" />

                <div className="relative">
                  <div className="flex items-start justify-between">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-sm">
                      <m.icon className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-mono text-muted-foreground/50">0{i + 1}</span>
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-foreground">{m.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed line-clamp-2">{m.description}</p>

                  <div className="mt-5 flex items-baseline gap-2 pb-4 border-b border-border">
                    <span className="text-2xl font-bold text-foreground">{stats.value}</span>
                    <span className="text-xs text-muted-foreground">{stats.label}</span>
                  </div>

                  <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    Ouvrir le tableau de bord
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}

function moduleStats(key: string): { value: string; label: string } {
  switch (key) {
    case "users-web":
      return { value: String(usersWeb.length), label: "comptes" };
    case "users-mobile":
      return { value: "647", label: "citoyens" };
    case "posts":
      return { value: String(posts.length), label: "publications" };
    case "stories":
      return { value: "12", label: "stories actives" };
    case "sondages":
      return { value: String(sondages.length), label: `${sondages.reduce((a,s)=>a+s.total,0)} votes` };
    case "signalements":
      return { value: String(signalements.length), label: "dossiers" };
    case "idees":
      return { value: String(idees.length), label: "propositions" };
    case "statistiques":
      return { value: "BI", label: "tableau de bord global" };
    default:
      return { value: "—", label: "" };
  }
}
