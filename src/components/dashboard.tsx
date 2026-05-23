import { type ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export function KpiCard({
  label,
  value,
  delta,
  hint,
  icon,
  tone = "default",
}: {
  label: string;
  value: string | number;
  delta?: number;
  hint?: string;
  icon?: ReactNode;
  tone?: "default" | "primary" | "warning" | "info" | "danger";
}) {
  const tones: Record<string, string> = {
    default: "bg-card",
    primary: "bg-gradient-to-br from-primary to-primary-glow text-primary-foreground border-transparent",
    warning: "bg-amber-50 border-amber-100",
    info: "bg-blue-50 border-blue-100",
    danger: "bg-red-50 border-red-100",
  };
  const iconWrap: Record<string, string> = {
    default: "bg-primary/10 text-primary",
    primary: "bg-white/20 text-primary-foreground",
    warning: "bg-amber-100 text-amber-700",
    info: "bg-blue-100 text-blue-700",
    danger: "bg-red-100 text-red-700",
  };
  const up = (delta ?? 0) >= 0;
  return (
    <div className={`relative overflow-hidden rounded-xl border border-border p-5 ${tones[tone]}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className={`text-[11px] uppercase tracking-wider font-semibold ${tone === "primary" ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
            {label}
          </div>
          <div className="mt-2 text-3xl font-bold tracking-tight leading-none">{value}</div>
          <div className="mt-2 flex items-center gap-2 text-xs">
            {typeof delta === "number" && (
              <span
                className={`inline-flex items-center gap-0.5 font-medium ${
                  tone === "primary"
                    ? "text-primary-foreground"
                    : up
                    ? "text-emerald-600"
                    : "text-red-600"
                }`}
              >
                {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {Math.abs(delta)}%
              </span>
            )}
            {hint && (
              <span className={tone === "primary" ? "text-primary-foreground/80" : "text-muted-foreground"}>
                {hint}
              </span>
            )}
          </div>
        </div>
        {icon && (
          <div className={`h-10 w-10 shrink-0 rounded-lg flex items-center justify-center ${iconWrap[tone]}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

export function SectionCard({
  title,
  subtitle,
  action,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-xl border border-border bg-card ${className}`}>
      <header className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border">
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

const PRIMARY = "oklch(0.68 0.17 148)";
const GLOW = "oklch(0.82 0.16 148)";
const PALETTE = [PRIMARY, GLOW, "#f59e0b", "#3b82f6", "#ef4444", "#8b5cf6"];

const tooltipStyle = {
  backgroundColor: "white",
  border: "1px solid oklch(0.91 0.02 145)",
  borderRadius: 8,
  fontSize: 12,
  padding: "8px 10px",
} as const;

export function AreaTrend({
  data,
  dataKey = "value",
  xKey = "label",
  height = 200,
}: {
  data: any[];
  dataKey?: string;
  xKey?: string;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="gradPrimary" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={PRIMARY} stopOpacity={0.35} />
            <stop offset="100%" stopColor={PRIMARY} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.93 0.02 145)" vertical={false} />
        <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: "oklch(0.5 0.03 155)" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "oklch(0.5 0.03 155)" }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Area type="monotone" dataKey={dataKey} stroke={PRIMARY} strokeWidth={2.5} fill="url(#gradPrimary)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function BarsCompare({
  data,
  dataKey = "value",
  xKey = "label",
  height = 220,
}: {
  data: any[];
  dataKey?: string;
  xKey?: string;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.93 0.02 145)" vertical={false} />
        <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: "oklch(0.5 0.03 155)" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "oklch(0.5 0.03 155)" }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "oklch(0.96 0.02 145)" }} />
        <Bar dataKey={dataKey} fill={PRIMARY} radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DonutBreakdown({
  data,
  height = 220,
}: {
  data: { label: string; value: number; color?: string }[];
  height?: number;
}) {
  const total = data.reduce((a, d) => a + d.value, 0);
  return (
    <div className="flex items-center gap-6">
      <div style={{ width: 180, height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="label" innerRadius={50} outerRadius={80} paddingAngle={3} stroke="none">
              {data.map((d, i) => (
                <Cell key={i} fill={d.color ?? PALETTE[i % PALETTE.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex-1 space-y-2.5">
        {data.map((d, i) => {
          const pct = total ? Math.round((d.value / total) * 100) : 0;
          return (
            <div key={i} className="flex items-center gap-3 text-sm">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color ?? PALETTE[i % PALETTE.length] }} />
              <span className="flex-1 truncate">{d.label}</span>
              <span className="font-semibold">{d.value}</span>
              <span className="text-muted-foreground text-xs w-10 text-right">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ActivityItem({
  icon,
  title,
  description,
  time,
  badge,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  time: string;
  badge?: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
      <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium truncate">{title}</p>
          {badge}
        </div>
        {description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{description}</p>}
      </div>
      <span className="text-xs text-muted-foreground whitespace-nowrap">{time}</span>
    </div>
  );
}
