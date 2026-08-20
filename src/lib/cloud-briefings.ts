import type { Briefing } from "@/lib/briefing";
import { supabase } from "@/integrations/supabase/client";

type SupabaseEnv = {
  url: string;
  key: string;
};

type BriefingInsert = {
  client_name: string | null;
  company: string | null;
  project_title: string | null;
  project_types: string[];
  form_data: Briefing;
  visual_references: Briefing["referencias"];
  status: "completed";
};

const getEnv = (): SupabaseEnv | null => {
  const env = import.meta.env as Record<string, string | undefined>;
  const url = env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_PUBLISHABLE_KEY ?? env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ""), key };
};

const textoONull = (valor: string) => {
  const limpio = valor.trim();
  return limpio.length ? limpio : null;
};

export const supabaseConfigurado = () => getEnv() !== null;

export async function guardarBriefingEnNube(briefing: Briefing) {
  const env = getEnv();
  if (!env) {
    return { ok: false, reason: "missing-env" as const };
  }

  const payload: BriefingInsert = {
    client_name: textoONull(briefing.cliente.nombre),
    company: textoONull(briefing.cliente.empresa),
    project_title:
      textoONull(briefing.logo.nombreExacto) ??
      textoONull(briefing.general.descripcion) ??
      textoONull(briefing.cliente.empresa) ??
      textoONull(briefing.cliente.nombre),
    project_types: briefing.tipos,
    form_data: briefing,
    visual_references: briefing.referencias,
    status: "completed",
  };

  try {
    const { data, error } = await (supabase as any)
      .from("briefings")
      .insert(payload)
      .select("id")
      .single();

    if (error) {
      return {
        ok: false,
        reason: "request-failed" as const,
        message: error.message,
      };
    }

    return { ok: true, id: data?.id as string | undefined };
  } catch (error) {
    return {
      ok: false,
      reason: "network-error" as const,
      message: error instanceof Error ? error.message : String(error),
    };
  }
}
