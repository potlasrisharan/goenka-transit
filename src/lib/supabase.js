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

const supabaseRealUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

// Use the exact same domain the user is currently on (Vercel proxy) to bypass Mobile ISP / Safari Tracker blocking
const supabaseProxyUrl = typeof window !== 'undefined' ? `${window.location.origin}/api/supabase` : supabaseRealUrl;

if (!supabaseRealUrl || !supabaseAnonKey) {
    console.warn(
        '[Goenka Transit] Supabase credentials not found.\n' +
        'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.\n' +
        'The app will fall back to mock data until credentials are configured.'
    );
}

export const supabase = supabaseRealUrl && supabaseAnonKey
    ? createClient(supabaseRealUrl, supabaseAnonKey, {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
        },
        global: {
            fetch: (...args) => {
                let [url, options] = args;

                // Route HTTP requests through the Vercel proxy to bypass strict Mobile network blockers
                // This does NOT affect WebSockets (wss://), which will still connect directly to the real Supabase URL!
                if (typeof window !== 'undefined' && typeof url === 'string' && supabaseRealUrl) {
                    url = url.replace(supabaseRealUrl, window.location.origin + '/api/supabase');
                }

                // iOS Safari/Chrome drops keepalive requests aggressively, leading to ERR_CONNECTION_TIMED_OUT
                // We strip keepalive from the fetch options to force standard connections.
                if (options && options.keepalive) {
                    delete options.keepalive;
                }
                return fetch(url, options);
            },
        }
    })
    : null;

/**
 * Check if Supabase is connected and configured.
 * @returns {boolean}
 */
export const isSupabaseConfigured = () => !!supabase;

export default supabase;
