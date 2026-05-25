import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Bell, Search, ArrowLeft, ChevronRight } from "lucide-react";
import { getModule, LOGO, BRAND, type ModuleKey } from "@/lib/modules";
import { logout } from "@/lib/auth";
import { Input } from "@/components/ui/input";

export function ModuleLayout({
  moduleKey,
  activeSection,
  onSectionChange,
  sectionCounts,
  title,
  description,
  actions,
  children,
}: {
  moduleKey: ModuleKey;
  activeSection: string;
  onSectionChange: (key: string) => void;
  sectionCounts?: Record<string, number | string>;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const mod = getModule(moduleKey);
  const Icon = mod.icon;

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar dédiée au module */}
      <aside className="hidden md:flex w-72 flex-col border-r border-border bg-sidebar">
        <Link
          to="/dashboard"
          className="group flex items-center gap-2 px-5 py-4 border-b border-sidebar-border text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          Retour aux modules
        </Link>

        <div className="px-5 py-5 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground flex items-center justify-center shadow-sm">
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                Module
              </div>
              <div className="text-sm font-bold text-sidebar-foreground truncate">
                {mod.title}
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <div className="pb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Sections
          </div>
          {mod.sections.map((s) => {
            const SIcon = s.icon;
            const active = s.key === activeSection;
            const count = sectionCounts?.[s.key];
            return (
              <button
                key={s.key}
                onClick={() => onSectionChange(s.key)}
                className={`w-full group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all ${
                  active
                    ? "bg-primary text-primary-foreground shadow-sm font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <SIcon className="h-4 w-4 shrink-0" />
                <span className="flex-1 text-left truncate">{s.label}</span>
                {count !== undefined && (
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${
                      active ? "bg-white/20 text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {count}
                  </span>
                )}
                {active && <ChevronRight className="h-3.5 w-3.5" />}
              </button>
            );
          })}
        </nav>

        <div className="m-3 rounded-lg border border-sidebar-border bg-card/50 p-3">
          <div className="flex items-center gap-2 mb-2">
            <img src={LOGO} alt="CUY" className="h-7 w-7 object-contain" />
            <div className="text-[11px] font-semibold leading-tight">{BRAND.short}</div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-1.5 rounded-md border border-border px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-10 flex items-center gap-4 border-b border-border bg-card/80 backdrop-blur px-6 py-3.5">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder={`Rechercher dans ${mod.short}...`} className="pl-9 bg-background" />
          </div>
          <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
          </button>
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-primary-foreground text-sm font-semibold">
            A
          </div>
        </header>

        <div className="px-6 pt-6 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Link to="/dashboard" className="hover:text-foreground">Tableau de bord</Link>
              <ChevronRight className="h-3 w-3" />
              <span>{mod.title}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
