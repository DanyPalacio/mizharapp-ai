"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const EXAMPLES = [
  "Compara Amazon vs Walmart desde 2020",
  "Analiza el crecimiento del mercado de IA",
  "Compara Nvidia vs AMD",
  "Compara OpenAI y Anthropic"
];

export default function PromptBox() {
  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function generate(p?: string) {
    const q = (p ?? prompt).trim();
    if ((!q && !file) || loading) return;
    setLoading(true);
    setError("");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = session ? { Authorization: `Bearer ${session.access_token}` } : {};
      let res: Response;
      if (file) {
        const fd = new FormData();
        fd.append("prompt", q || "Analiza este archivo y genera un dashboard ejecutivo");
        fd.append("file", file);
        res = await fetch("/api/generate", { method: "POST", body: fd, headers });
      } else {
        res = await fetch("/api/generate", {
          method: "POST",
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: q })
        });
      }
      const data = await res.json();
      if (data.slug) router.push(`/dashboards/${data.slug}`);
      else setError(data.error || "Error generando el dashboard");
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="mt-10 card p-3 max-w-3xl">
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); generate(); } }}
          placeholder={file ? `¿Qué quieres analizar de ${file.name}?` : "¿Qué quieres visualizar?"}
          rows={2}
          className="w-full resize-none px-3 py-2 text-base outline-none"
        />
        <div className="flex items-center justify-between px-2 pb-1 flex-wrap gap-2">
          <div className="flex items-center gap-3 text-sm">
            <input ref={fileRef} type="file" accept=".csv,.xls,.xlsx,.png,.jpg,.jpeg,.webp"
              className="hidden" onChange={e => setFile(e.target.files?.[0] ?? null)} />
            <button onClick={() => fileRef.current?.click()}
              className="text-ink/60 hover:text-ember font-medium">
              📎 CSV · Excel · Imagen
            </button>
            {file && (
              <span className="bg-ember/10 text-ember font-medium px-3 py-1 rounded-full flex items-center gap-2">
                {file.name}
                <button onClick={() => { setFile(null); if (fileRef.current) fileRef.current.value = ""; }}>✕</button>
              </span>
            )}
          </div>
          <button onClick={() => generate()} disabled={loading} className="btn-ember">
            {loading ? "Generando…" : "✦ Generate Dashboard"}
          </button>
        </div>
      </div>
      {error && <p className="mt-3 text-sm text-red-600 font-medium">{error}</p>}
      <div className="mt-6 flex flex-wrap gap-2">
        {EXAMPLES.map(e => (
          <button key={e} onClick={() => generate(e)}
            className="text-sm bg-white border border-line rounded-full px-4 py-2 hover:border-ember hover:text-ember transition">
            {e}
          </button>
        ))}
      </div>
    </>
  );
}
