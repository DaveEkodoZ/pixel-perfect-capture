import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, ArrowRight, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/auth";
import { LOGO, BRAND } from "@/lib/modules";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Connexion — CUY" },
      { name: "description", content: "Espace administrateur de la Communauté Urbaine de Yaoundé." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setTimeout(() => {
      login(email);
      navigate({ to: "/dashboard" });
    }, 500);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left visual panel — minimal, logo-forward */}
      <div
        className="hidden lg:flex flex-col items-center justify-center p-12 relative overflow-hidden text-primary-foreground"
        style={{ background: "var(--gradient-primary)" }}
      >
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <img src={LOGO} alt="Logo CUY" className="h-72 w-72 object-contain drop-shadow-2xl" />
          <div className="mt-10 text-[11px] uppercase tracking-[0.35em] opacity-80">
            République du Cameroun
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight">{BRAND.name}</div>
        </div>

        <div className="absolute bottom-8 left-0 right-0 text-center text-primary-foreground/70 text-xs">
          © {new Date().getFullYear()} {BRAND.short}
        </div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-background relative">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <img src={LOGO} alt="CUY" className="h-12 w-12 object-contain" />
            <div className="font-bold">{BRAND.short}</div>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Espace administrateur
          </div>

          <h1 className="text-4xl font-bold tracking-tight">Bienvenue à nouveau</h1>
          <p className="text-muted-foreground mt-2">
            Connectez-vous pour accéder à votre espace de gestion.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Adresse email</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@cuy.cm"
                  className="pl-11 h-12 bg-muted/40 border-transparent focus-visible:bg-card focus-visible:border-primary"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={show ? "text" : "password"}
                  placeholder="••••••••••"
                  className="pl-11 pr-11 h-12 bg-muted/40 border-transparent focus-visible:bg-card focus-visible:border-primary"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
                <input type="checkbox" className="h-4 w-4 rounded border-border accent-primary" />
                Se souvenir de moi
              </label>
              <a href="#" className="text-primary hover:underline font-medium">
                Mot de passe oublié ?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
              style={{ background: "var(--gradient-primary)" }}
              disabled={loading}
            >
              {loading ? "Connexion en cours..." : (
                <>Accéder à mon espace <ArrowRight className="ml-2 h-4 w-4" /></>
              )}
            </Button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            Connexion chiffrée · Accès strictement réservé au personnel autorisé
          </div>
        </div>
      </div>
    </div>
  );
}
