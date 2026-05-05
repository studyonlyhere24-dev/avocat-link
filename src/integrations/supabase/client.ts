import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Vite exposes VITE_* env vars via import.meta.env at build time.
// On Vercel, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in:
//   Project Settings → Environment Variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

function isPlaceholder(v: string | undefined) {
  return !v || v === 'undefined' || v.includes('placeholder') || v.includes('your-project');
}

function createSupabaseClient() {
  if (isPlaceholder(SUPABASE_URL) || isPlaceholder(SUPABASE_ANON_KEY)) {
    console.warn(
      '[Avocat-Link] Supabase env vars not configured.\n' +
      'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel → Project Settings → Environment Variables.\n' +
      'Auth, database, and messaging will not work until these are set.'
    );
    // Return a no-op placeholder so the build succeeds — auth calls will fail with a clear message
    return createClient<Database>(
      'https://placeholder.supabase.co',
      'placeholder-key',
      { auth: { persistSession: false, autoRefreshToken: false } }
    );
  }

  return createClient<Database>(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    auth: {
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

// Lazy singleton — created once on first access
let _client: ReturnType<typeof createSupabaseClient> | null = null;

function getClient() {
  if (!_client) _client = createSupabaseClient();
  return _client;
}

// Import like: import { supabase } from "@/integrations/supabase/client"
export const supabase = new Proxy({} as ReturnType<typeof createSupabaseClient>, {
  get(_, prop, receiver) {
    return Reflect.get(getClient(), prop, receiver);
  },
});
