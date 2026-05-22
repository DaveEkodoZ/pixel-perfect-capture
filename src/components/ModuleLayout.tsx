import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LogOut, Bell, Search } from "lucide-react";
import { MODULES, DASHBOARD_ITEM, LOGO, BRAND } from "@/lib/modules";
import { logout } from "@/lib/auth";
import { Input } from "@/components/ui/input";

export function ModuleLayout({
  title,
  description,
  tabs,
  children,
}: {
  title: string;
  description?: string;
  tabs?: { key: string; label: string; active?: boolean; onClick?: () => void }[];
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const { location } = useRouterState();

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-sidebar">
        <Link to="/dashboard" className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
          <img src={LOGO} alt="CUY" className="h-10 w-10 object-contain" />
          <div>
            <div className="text-sm font-bold text-sidebar-foreground leading-tight">{BRAND.short}</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Administration</div>
          </div>
        </Link>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <SidebarLink
            to={DASHBOARD_ITEM.path}
            label={DASHBOARD_ITEM.title}
            icon={<DASHBOARD_ITEM.icon className="h-4 w-4" />}
            active={location.pathname === DASHBOARD_ITEM.path}
          />
          <div className="pt-4 pb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Modules
          </div>
          {MODULES.map((m) => (
            <SidebarLink
              key={m.key}
              to={m.path}
              label={m.title}
              icon={<m.icon className="h-4 w-4" />}
              active={location.pathname === m.path}
            />
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="m-3 flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </button>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-10 flex items-center gap-4 border-b border-border bg-card/80 backdrop-blur px-6 py-4">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Rechercher..." className="pl-9 bg-background" />
          </div>
          <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
          </button>
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-primary-foreground text-sm font-semibold">
            A
          </div>
        </header>

        <div className="px-6 pt-6">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}

          {tabs && tabs.length > 0 && (
            <div className="mt-5 flex gap-1 border-b border-border">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={t.onClick}
                  className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                    t.active
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

function SidebarLink({
  to,
  label,
  icon,
  active,
}: {
  to: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
        active
          ? "bg-primary text-primary-foreground shadow-sm font-medium"
          : "text-sidebar-foreground hover:bg-sidebar-accent"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
