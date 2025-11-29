import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Em um ambiente de produção/build, o Vite injeta essas variáveis.
  // Se estiver faltando, o erro será lançado, mas confiamos que o ambiente Vercel as fornecerá.
  throw new Error('VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be defined.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);