/**
 * Supabase Integration Test – Goenka Transit
 *
 * This file demonstrates how to use the Supabase client and hooks.
 * It is NOT imported anywhere in the app — it serves as reference documentation.
 *
 * ─────────────────────────────────────────────
 * EXAMPLE 1: Direct client usage (in any file)
 * ─────────────────────────────────────────────
 *
 *   import { supabase, isSupabaseConfigured } from '../lib/supabase';
 *
 *   async function fetchRoutes() {
 *     if (!isSupabaseConfigured()) {
 *       console.log('Supabase not configured, using mock data');
 *       return;
 *     }
 *
 *     const { data, error } = await supabase
 *       .from('routes')
 *       .select('*')
 *       .order('name', { ascending: true });
 *
 *     if (error) console.error('Error:', error);
 *     else console.log('Routes from Supabase:', data);
 *   }
 *
 * ─────────────────────────────────────────────
 * EXAMPLE 2: Using useSupabaseQuery hook (in a React component)
 * ─────────────────────────────────────────────
 *
 *   import { useSupabaseQuery } from '../hooks/useSupabase';
 *
 *   function RoutesPage() {
 *     const { data: routes, loading, error, refetch } = useSupabaseQuery('routes', {
 *       orderBy: 'name',
 *       ascending: true,
 *     });
 *
 *     if (loading) return <p>Loading routes...</p>;
 *     if (error) return <p>Error: {error}</p>;
 *
 *     return (
 *       <ul>
 *         {routes?.map(r => <li key={r.id}>{r.name} – {r.total_distance}</li>)}
 *       </ul>
 *     );
 *   }
 *
 * ─────────────────────────────────────────────
 * EXAMPLE 3: Filtered query (e.g., buses on a specific route)
 * ─────────────────────────────────────────────
 *
 *   const { data: buses } = useSupabaseQuery('buses', {
 *     filters: [{ column: 'route_id', operator: 'eq', value: 'R1' }],
 *     select: 'id, number, name, capacity',
 *   });
 *
 * ─────────────────────────────────────────────
 * EXAMPLE 4: Insert a complaint (mutation hook)
 * ─────────────────────────────────────────────
 *
 *   import { useSupabaseMutation } from '../hooks/useSupabase';
 *
 *   function ComplaintForm() {
 *     const { insert, loading } = useSupabaseMutation('complaints');
 *
 *     const handleSubmit = async (formData) => {
 *       const { data, error } = await insert({
 *         student_id: 'STU001',
 *         bus_id: 'BUS01',
 *         category: 'Seat',
 *         subject: formData.subject,
 *         description: formData.description,
 *       });
 *
 *       if (!error) console.log('Complaint created:', data);
 *     };
 *   }
 *
 * ─────────────────────────────────────────────
 * EXAMPLE 5: Real-time bus position updates
 * ─────────────────────────────────────────────
 *
 *   import { useSupabaseRealtime } from '../hooks/useSupabase';
 *
 *   function BusTracker() {
 *     useSupabaseRealtime('bus_positions', {
 *       onUpdate: (payload) => {
 *         console.log('Bus moved:', payload.new);
 *         // Update map marker position
 *       },
 *     });
 *   }
 *
 * ─────────────────────────────────────────────
 * EXAMPLE 6: Seat booking with transaction
 * ─────────────────────────────────────────────
 *
 *   const { update } = useSupabaseMutation('seats');
 *
 *   const bookSeat = async (busId, seatNumber, studentId) => {
 *     const { data, error } = await update(
 *       { bus_id: busId, seat_number: seatNumber },     // match
 *       { student_id: studentId, is_booked: true }       // updates
 *     );
 *     return { data, error };
 *   };
 */

// Inline test function — run from browser console:
// import('/src/examples/supabaseTest.js').then(m => m.testRoutesQuery())

import { supabase, isSupabaseConfigured } from '../lib/supabase';

export async function testRoutesQuery() {
    console.log('=== Goenka Transit – Supabase Test ===');
    console.log('Supabase configured:', isSupabaseConfigured());

    if (!isSupabaseConfigured()) {
        console.warn('Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env first.');
        return null;
    }

    console.log('Fetching routes from Supabase...');
    const { data, error } = await supabase.from('routes').select('*');

    if (error) {
        console.error('❌ Query failed:', error.message);
        return null;
    }

    console.log(`✅ Fetched ${data.length} routes:`);
    console.table(data);
    return data;
}
