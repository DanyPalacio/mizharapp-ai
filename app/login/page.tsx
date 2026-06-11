"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

// Auth liviano del spec: Google OAuth + email magic link. Sin formularios complejos.
export default function Login() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function magicLink() {
    if (!email.trim()) return;
    const { error } = await supabase.auth.signInWithOtp({
      email, options: { emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined }
    });
    if (error) setError(error.message);
    else setSent(true);
  }

  async function google() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: typeof window !== "undefined" ? window.location.origin : undefined }
    });
    if (error) setError(error.message);
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="card p-8 w-full max-w-sm">
        <a href="/" className="font-display font-bold text-lg">Visual<span className="text-ember">Stats</span>.ai</a>
        <h1 className="font-display font-bold text-2xl mt-6">Entra a tu cuenta</h1>
        <p className="text-sm text-ink/55 mt-1">Sin contraseñas. Sin formularios largos.</p>

        <button onClick={google}
          className="w-full mt-6 border border-line rounded-xl px-4 py-3 font-semibold text-sm hover:border-ink transition">
          Continuar con Google
        </button>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-line" /><span className="text-xs text-ink/40">o</span><div className="flex-1 h-px bg-line" />
        </div>

        {sent ? (
          <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl p-4">
            ✓ Revisa tu correo — te enviamos un enlace mágico para entrar.
          </p>
        ) : (
          <>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="tu@email.com"
              className="w-full border border-line rounded-xl px-4 py-3 text-sm" />
            <button onClick={magicLink} className="btn-ember w-full mt-3 text-sm">Enviar magic link</button>
          </>
        )}
        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
      </div>
    </main>
  );
}
