import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowRight, LogOut } from "lucide-react";
import { MODULES, LOGO, BRAND } from "@/lib/modules";
import { getAuth, logout } from "@/lib/auth";

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

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={LOGO} alt="CUY" className="h-11 w-11 object-contain" />
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                République du Cameroun
              </div>
              <div className="font-bold text-foreground leading-tight">{BRAND.name}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="h-4 w-4" /> Déconnexion
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-border" style={{ background: "var(--gradient-soft)" }}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-card border border-border px-3 py-1 text-xs font-medium text-primary mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Espace administrateur
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Bonjour, <span className="text-primary">Administrateur</span>
          </h1>
          <p className="mt-3 text-muted-foreground max-w-2xl">
            Sélectionnez un module pour gérer le contenu et les interactions de la plateforme citoyenne de Yaoundé.
          </p>
        </div>
      </section>

      {/* Module cards */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {MODULES.map((m, i) => (
            <Link
              key={m.key}
              to={m.path}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:-translate-y-1"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors" />

              <div className="relative">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-sm">
                  <m.icon className="h-6 w-6" />
                </div>

                <h3 className="mt-5 text-lg font-bold text-foreground">{m.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{m.description}</p>

                <div className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Ouvrir le module
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>

                <div className="absolute top-0 right-0 text-xs font-mono text-muted-foreground/40">
                  0{i + 1}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
