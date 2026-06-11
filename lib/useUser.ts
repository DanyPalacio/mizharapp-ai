"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export type Profile = { id: string; plan: "free" | "pro"; role: string; full_name?: string };

export function useUser() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user ?? null);
      if (data.user) {
        const { data: p } = await supabase.from("profiles").select("*").eq("id", data.user.id).single();
        if (p) setProfile(p as Profile);
        else {
          // crear perfil free al primer login
          const np = { id: data.user.id, plan: "free", role: "user", full_name: data.user.user_metadata?.full_name };
          await supabase.from("profiles").insert(np);
          setProfile(np as Profile);
        }
      }
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return { user, profile, loading, isPro: profile?.plan === "pro" || profile?.role === "admin" };
}
