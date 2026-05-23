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
    <div className="min-h-screen grid lg:grid-cols-[1.05fr_1fr] bg-background">
      {/* Left visual panel */}
      <div
        className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden text-primary-foreground"
        style={{ background: "var(--gradient-primary)" }}
      >
        {/* Decorative layers */}
        <div className="absolute inset-0 opacity-[0.12]"
             style={{ backgroundImage: "radial-gradient(circle at 20% 30%, white 0, transparent 40%), radial-gradient(circle at 80% 70%, white 0, transparent 40%)" }} />
        <div className="absolute -bottom-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-white/10 blur-3xl" />
        <div className="absolute top-1/4 -left-24 h-72 w-72 rounded-full bg-white/15 blur-2xl" />
        <div className="absolute inset-0"
             style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "48px 48px", maskImage: "linear-gradient(180deg, transparent, black 30%, black 70%, transparent)" }} />

        <div className="relative z-10 flex items-center gap-3">
          <img src={LOGO} alt="Logo CUY" className="h-14 w-14 object-contain bg-white rounded-xl p-1.5 shadow-lg" />
          <div>
            <div className="text-[10px] uppercase tracking-[0.25em] opacity-80">République du Cameroun</div>
            <div className="text-lg font-bold leading-tight">{BRAND.name}</div>
          </div>
        </div>

        <div className="relative z-10 max-w-md">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-medium mb-5 border border-white/20">
            <ShieldCheck className="h-3.5 w-3.5" /> Espace sécurisé
          </div>
          <h2 className="text-5xl font-bold leading-[1.05] tracking-tight">
            Une ville moderne, <br />
            <span className="italic font-normal opacity-90">à l'écoute</span> de ses citoyens.
          </h2>
          <p className="mt-5 text-primary-foreground/90 text-base leading-relaxed">
            Centralisez actualités, signalements, sondages et idées des habitants de Yaoundé dans une plateforme unifiée et performante.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { v: "12 547", l: "Citoyens" },
              { v: "98%", l: "Disponibilité" },
              { v: "24/7", l: "Support" },
            ].map((s) => (
              <div key={s.l} className="rounded-xl border border-white/20 bg-white/10 backdrop-blur px-4 py-3">
                <div className="text-2xl font-bold">{s.v}</div>
                <div className="text-[11px] uppercase tracking-wider opacity-80">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-primary-foreground/80 text-xs">
          © {new Date().getFullYear()} {BRAND.name}. Tous droits réservés.
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
