"use client";
import { useUser } from "@/lib/useUser";

export default function ProGate() {
  const { user, isPro, loading } = useUser();
  if (loading || isPro) return null;
  return (
    <div className="mx-8 mt-6 rounded-2xl border border-ember/40 bg-gradient-to-r from-ember/10 to-amber-50 px-5 py-4 flex items-center justify-between gap-4 flex-wrap no-print">
      <p className="text-sm">
        <b className="text-ember">✦ Mizhar AI</b> es parte del plan <b>Pro</b> —
        {user ? " estás en plan Free viendo el preview." : " inicia sesión y suscríbete para análisis con tus datos reales."}
      </p>
      <div className="flex gap-2 shrink-0">
        {!user && <a href="/login" className="border border-line bg-white rounded-xl px-4 py-2 text-sm font-medium">Sign In</a>}
        <a href="/pricing" className="btn-ember text-sm py-2">Upgrade to Pro</a>
      </div>
    </div>
  );
}
