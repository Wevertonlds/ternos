import { createClient } from '@supabase/supabase-js';

// Tenta ler com o prefixo VITE_ (padrão Vite) ou sem prefixo (fallback para alguns ambientes de build)
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL)?.trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY)?.trim();

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be defined in .env file');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);