import { createClient } from '@supabase/supabase-js';

/**
 * Supabase Client - Goenka Transit
 *
 * This is the single, reusable Supabase client instance used across the app.
 * Credentials are loaded from environment variables (VITE_ prefix for Vite).
 *
 * Setup:
 *   1. Copy .env.example to .env (or edit .env directly)
 *   2. Set VITE_SUPABASE_URL to your Supabase project URL
 *   3. Set VITE_SUPABASE_ANON_KEY to your Supabase anon/public key
 *   4. Restart the dev server (`npm run dev`)
 *
 * Usage:
 *   import { supabase } from '@/lib/supabase';
 *   const { data, error } = await supabase.from('routes').select('*');
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
        '[Goenka Transit] Supabase credentials not found.\n' +
        'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.\n' +
        'The app will fall back to mock data until credentials are configured.'
    );
}

export const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
        },
    })
    : null;

/**
 * Check if Supabase is connected and configured.
 * @returns {boolean}
 */
export const isSupabaseConfigured = () => !!supabase;

export default supabase;
