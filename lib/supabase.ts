import { createClient } from "@supabase/supabase-js";

// Patrón validado: placeholders para evitar fallos de build en Vercel
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export const supabase = createClient(url, anon);

export function serviceClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-key";
  return createClient(url, key, { auth: { persistSession: false } });
}
