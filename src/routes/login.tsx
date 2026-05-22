import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, ArrowRight } from "lucide-react";
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
      {/* Left visual panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden"
           style={{ background: "var(--gradient-primary)" }}>
        <div className="flex items-center gap-3 text-primary-foreground">
          <img src={LOGO} alt="Logo CUY" className="h-14 w-14 object-contain bg-white rounded-xl p-1.5" />
          <div>
            <div className="text-xs uppercase tracking-[0.2em] opacity-80">République du Cameroun</div>
            <div className="text-lg font-bold">{BRAND.name}</div>
          </div>
        </div>

        <div className="relative z-10 text-primary-foreground max-w-md">
          <h2 className="text-4xl font-bold leading-tight">
            Une ville moderne, <br />à l'écoute de ses citoyens.
          </h2>
          <p className="mt-4 text-primary-foreground/90 text-base leading-relaxed">
            Administrez les actualités, signalements, sondages et idées des habitants de Yaoundé depuis une interface unifiée.
          </p>
        </div>

        <div className="text-primary-foreground/80 text-xs">
          © {new Date().getFullYear()} {BRAND.name}. Tous droits réservés.
        </div>

        {/* Decorative shapes */}
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute top-1/3 -left-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <img src={LOGO} alt="CUY" className="h-12 w-12 object-contain" />
            <div className="font-bold">{BRAND.short}</div>
          </div>

          <h1 className="text-3xl font-bold tracking-tight">Bienvenue</h1>
          <p className="text-muted-foreground mt-2">
            Connectez-vous à votre espace d'administration.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@cuy.cm"
                  className="pl-10 h-11"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 h-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" className="rounded border-border" />
                Se souvenir de moi
              </label>
              <a href="#" className="text-primary hover:underline font-medium">
                Mot de passe oublié ?
              </a>
            </div>

            <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={loading}>
              {loading ? "Connexion..." : (
                <>Se connecter <ArrowRight className="ml-2 h-4 w-4" /></>
              )}
            </Button>
          </form>

          <p className="mt-8 text-xs text-center text-muted-foreground">
            Accès strictement réservé au personnel autorisé.
          </p>
        </div>
      </div>
    </div>
  );
}
