import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { LOGO, BRAND } from "@/lib/modules";

export function RouteTransitionLoader() {
  const status = useRouterState({ select: (s) => s.status });
  const isPending = status === "pending";
  const [visible, setVisible] = useState(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (isPending) {
      setVisible(true);
    } else {
      hideTimer.current = setTimeout(() => setVisible(false), 400);
    }
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [isPending]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background animate-in fade-in duration-200"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="relative flex flex-col items-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary/10 blur-2xl animate-pulse" />
          <img
            src={LOGO}
            alt="CUY"
            className="relative h-56 w-56 md:h-64 md:w-64 object-contain animate-pulse"
          />
        </div>

        <div className="mt-8 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
          <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
          <span className="h-2 w-2 rounded-full bg-primary animate-bounce" />
        </div>

        <div className="mt-5 text-center">
          <div className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
            République du Cameroun
          </div>
          <div className="mt-1 text-base font-bold tracking-tight text-foreground">
            {BRAND.name}
          </div>
        </div>
      </div>
    </div>
  );
}
