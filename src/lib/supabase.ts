import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = "https://unjassqehiyicdbzoqif.supabase.co";
    const key = [
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
      "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuamFzc3FlaGl5aWNkYnpvcWlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3OTI1MzgsImV4cCI6MjA5NzM2ODUzOH0",
      "vgkpACvVrTPpVrJAI-nxViTSkECXqjfhFXg9KGLatAY",
    ].join(".");
    _supabase = createClient(url, key);
  }
  return _supabase;
}

export const supabase = getSupabase();
