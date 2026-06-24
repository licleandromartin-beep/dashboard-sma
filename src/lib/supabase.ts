import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://unjassqehiyicdbzoqif.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuamFzc3FlaGl5aWNkYnpvcWlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3OTI1MzgsImV4cCI6MjA5NzM2ODUzOH0.vgkpACvVrTPpVrJAI-nxViTSkECXqjfhFXg9KGLatAY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
