import { createClient } from "@supabase/supabase-js";
import { env } from "./env";

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabasePublicKey = env.VITE_SUPABASE_PUBLIC_KEY;

export const supabase = createClient(supabaseUrl, supabasePublicKey);
