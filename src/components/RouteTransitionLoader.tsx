import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { LOGO, BRAND } from "@/lib/modules";

export function RouteTransitionLoader() {
  const status = useRouterState({ select: (s) => s.status });
  const isLoading = status === "pending";
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Show on initial mount briefly for first paint
    setMounted(true);
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (isLoading) {
      setVisible(true);
    } else {
      // Keep visible briefly so it always shows on transitions
      const t = setTimeout(() => setVisible(false), 450);
      return () => clearTimeout(t);
    }
  }, [isLoading, mounted]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center animate-in fade-in duration-200"
      style={{ background: "var(--gradient-primary)" }}
      aria-busy="true"
      aria-live="polite"
    >
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-white/10 blur-3xl" />

      <div className="relative flex flex-col items-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-white/20 blur-2xl animate-pulse" />
          <img
            src={LOGO}
            alt="CUY"
            className="relative h-56 w-56 md:h-64 md:w-64 object-contain drop-shadow-2xl animate-pulse"
          />
        </div>

        <div className="mt-10 flex items-center gap-3 text-primary-foreground">
          <span className="h-2 w-2 rounded-full bg-white animate-bounce [animation-delay:-0.3s]" />
          <span className="h-2 w-2 rounded-full bg-white animate-bounce [animation-delay:-0.15s]" />
          <span className="h-2 w-2 rounded-full bg-white animate-bounce" />
        </div>

        <div className="mt-6 text-center text-primary-foreground">
          <div className="text-[11px] uppercase tracking-[0.35em] opacity-80">
            République du Cameroun
          </div>
          <div className="mt-1 text-lg font-bold tracking-tight">{BRAND.name}</div>
        </div>
      </div>
    </div>
  );
}
