import { type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Info, Pencil, Plus, Trash2, Play as PlayIcon, Pause as PauseIcon, type LucideIcon } from "lucide-react";

export type FieldType = "text" | "email" | "tel" | "textarea" | "select" | "url";
export interface ModalField {
  name: string;
  label: string;
  type?: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

type Mode = "info" | "add" | "edit" | "confirm";

const ICONS: Record<Mode, LucideIcon> = {
  info: Info,
  add: Plus,
  edit: Pencil,
  confirm: AlertTriangle,
};

const TITLES: Record<Mode, string> = {
  info: "Détails",
  add: "Nouvel élément",
  edit: "Modifier",
  confirm: "Confirmer l'action",
};

export function EntityModal({
  open,
  mode,
  title,
  description,
  fields,
  data,
  onChange,
  onClose,
  onSubmit,
  submitLabel,
  destructive,
  infoRows,
  extra,
}: {
  open: boolean;
  mode: Mode;
  title?: string;
  description?: string;
  fields?: ModalField[];
  data?: Record<string, any>;
  onChange?: (key: string, value: any) => void;
  onClose: () => void;
  onSubmit?: () => void;
  submitLabel?: string;
  destructive?: boolean;
  infoRows?: { label: string; value: ReactNode }[];
  extra?: ReactNode;
}) {
  const Icon = ICONS[mode];
  const heading = title ?? TITLES[mode];

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden border-0 shadow-2xl">
        {/* Header coloré */}
        <div
          className={`px-6 py-5 border-b border-border ${
            destructive
              ? "bg-gradient-to-br from-red-50 to-white"
              : mode === "info"
              ? "bg-gradient-to-br from-blue-50 to-white"
              : "bg-gradient-to-br from-primary/10 to-white"
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                destructive
                  ? "bg-red-500 text-white"
                  : mode === "info"
                  ? "bg-blue-500 text-white"
                  : "bg-gradient-to-br from-primary to-primary-glow text-primary-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <DialogHeader className="flex-1 space-y-1 text-left">
              <DialogTitle className="text-lg">{heading}</DialogTitle>
              {description && (
                <DialogDescription className="text-sm">{description}</DialogDescription>
              )}
            </DialogHeader>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
          {mode === "info" && infoRows && (
            <dl className="space-y-3">
              {infoRows.map((r, i) => (
                <div
                  key={i}
                  className="grid grid-cols-3 gap-3 py-2 border-b border-border last:border-0"
                >
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground font-semibold col-span-1">
                    {r.label}
                  </dt>
                  <dd className="text-sm col-span-2 break-words">{r.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {(mode === "add" || mode === "edit") && fields && (
            <div className="space-y-4">
              {fields.map((f) => (
                <div key={f.name} className="space-y-1.5">
                  <Label htmlFor={f.name} className="text-xs font-semibold">
                    {f.label}
                    {f.required && <span className="text-red-500 ml-0.5">*</span>}
                  </Label>
                  {f.type === "textarea" ? (
                    <Textarea
                      id={f.name}
                      placeholder={f.placeholder}
                      value={data?.[f.name] ?? ""}
                      onChange={(e) => onChange?.(f.name, e.target.value)}
                      className="min-h-[90px]"
                    />
                  ) : f.type === "select" ? (
                    <select
                      id={f.name}
                      value={data?.[f.name] ?? ""}
                      onChange={(e) => onChange?.(f.name, e.target.value)}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="">— Sélectionner —</option>
                      {f.options?.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      id={f.name}
                      type={f.type ?? "text"}
                      placeholder={f.placeholder}
                      value={data?.[f.name] ?? ""}
                      onChange={(e) => onChange?.(f.name, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {mode === "confirm" && (
            <p className="text-sm text-muted-foreground">
              {description ?? "Cette action est irréversible. Voulez-vous continuer ?"}
            </p>
          )}

          {extra}
        </div>

        <DialogFooter className="px-6 py-4 border-t border-border bg-muted/30">
          <Button variant="outline" onClick={onClose}>
            {mode === "info" ? "Fermer" : "Annuler"}
          </Button>
          {mode !== "info" && (
            <Button
              onClick={onSubmit}
              variant={destructive ? "destructive" : "default"}
            >
              {submitLabel ??
                (mode === "add" ? "Créer" : mode === "edit" ? "Enregistrer" : "Confirmer")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** Boutons d'action ligne (icônes uniquement, tooltip natif). */
export function RowActions({
  onInfo,
  onEdit,
  onToggle,
  isActive,
  onDelete,
}: {
  onInfo?: () => void;
  onEdit?: () => void;
  onToggle?: () => void;
  isActive?: boolean;
  onDelete?: () => void;
}) {
  return (
    <div className="inline-flex items-center gap-1">
      {onInfo && (
        <IconBtn title="Détails" onClick={onInfo} variant="ghost">
          <Info className="h-4 w-4" />
        </IconBtn>
      )}
      {onEdit && (
        <IconBtn title="Modifier" onClick={onEdit} variant="ghost">
          <Pencil className="h-4 w-4" />
        </IconBtn>
      )}
      {onToggle && (
        <IconBtn
          title={isActive ? "Désactiver" : "Activer"}
          onClick={onToggle}
          variant={isActive ? "warn" : "primary"}
        >
          {isActive ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
        </IconBtn>
      )}
      {onDelete && (
        <IconBtn title="Supprimer" onClick={onDelete} variant="danger">
          <Trash2 className="h-4 w-4" />
        </IconBtn>
      )}
    </div>
  );
}

function IconBtn({
  children,
  title,
  onClick,
  variant = "ghost",
}: {
  children: ReactNode;
  title: string;
  onClick: () => void;
  variant?: "ghost" | "danger" | "warn" | "primary";
}) {
  const cls: Record<string, string> = {
    ghost: "text-muted-foreground hover:text-foreground hover:bg-muted",
    danger: "text-red-600 hover:bg-red-50",
    warn: "text-amber-600 hover:bg-amber-50",
    primary: "text-primary hover:bg-primary/10",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors ${cls[variant]}`}
    >
      {children}
    </button>
  );
}
