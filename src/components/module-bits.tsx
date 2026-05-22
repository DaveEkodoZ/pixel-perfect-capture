import { type ReactNode } from "react";

export function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{label}</div>
          <div className="mt-2 text-2xl font-bold">{value}</div>
          {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
        </div>
        {icon && (
          <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    ACTIF: "bg-primary/15 text-primary",
    TERMINE: "bg-muted text-muted-foreground",
    EN_ATTENTE: "bg-amber-100 text-amber-700",
    EN_COURS: "bg-blue-100 text-blue-700",
    RESOLU: "bg-primary/15 text-primary",
    VALIDE: "bg-primary/15 text-primary",
    REJETE: "bg-red-100 text-red-700",
    ADMIN: "bg-primary/15 text-primary",
    MODERATEUR: "bg-accent text-accent-foreground",
    USER: "bg-muted text-muted-foreground",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${map[status] ?? "bg-muted text-muted-foreground"}`}>
      {status.replace("_", " ")}
    </span>
  );
}

export function ActiveDot({ active }: { active: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs">
      <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-primary" : "bg-muted-foreground/40"}`} />
      {active ? "Actif" : "Inactif"}
    </span>
  );
}
