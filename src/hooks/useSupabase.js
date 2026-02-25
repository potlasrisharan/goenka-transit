import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * useSupabaseQuery – Generic hook for fetching data from any Supabase table.
 *
 * @param {string} table - Table name (e.g., 'routes', 'buses', 'students')
 * @param {object} options
 * @param {string}   options.select   - Columns to select (default: '*')
 * @param {object[]} options.filters  - Array of { column, operator, value } filters
 * @param {string}   options.orderBy  - Column to order by
 * @param {boolean}  options.ascending - Sort direction (default: true)
 * @param {number}   options.limit    - Row limit
 * @param {boolean}  options.enabled  - Whether to run the query (default: true)
 *
 * @returns {{ data, error, loading, refetch }}
 *
 * @example
 * // Fetch all routes
 * const { data: routes, loading } = useSupabaseQuery('routes');
 *
 * // Fetch buses on a specific route
 * const { data: buses } = useSupabaseQuery('buses', {
 *   filters: [{ column: 'route_id', operator: 'eq', value: 'R1' }],
 *   orderBy: 'number',
 * });
 */
export function useSupabaseQuery(table, options = {}) {
    const {
        select = '*',
        filters = [],
        orderBy = null,
        ascending = true,
        limit = null,
        enabled = true,
    } = options;

    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(async () => {
        if (!isSupabaseConfigured()) {
            setError('Supabase not configured. Using mock data.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            let query = supabase.from(table).select(select);

            // Apply filters
            filters.forEach(({ column, operator, value }) => {
                query = query.filter(column, operator, value);
            });

            // Apply ordering
            if (orderBy) {
                query = query.order(orderBy, { ascending });
            }

            // Apply limit
            if (limit) {
                query = query.limit(limit);
            }

            const { data: result, error: queryError } = await query;

            if (queryError) {
                setError(queryError.message);
                console.error(`[Supabase] Error fetching ${table}:`, queryError);
            } else {
                setData(result);
            }
        } catch (err) {
            setError(err.message);
            console.error(`[Supabase] Unexpected error fetching ${table}:`, err);
        } finally {
            setLoading(false);
        }
    }, [table, select, JSON.stringify(filters), orderBy, ascending, limit]);

    useEffect(() => {
        if (enabled) {
            fetchData();
        }
    }, [fetchData, enabled]);

    return { data, error, loading, refetch: fetchData };
}

/**
 * useSupabaseMutation – Hook for inserting, updating, or deleting rows.
 *
 * @param {string} table - Table name
 * @returns {{ insert, update, remove, loading, error }}
 *
 * @example
 * const { insert, loading } = useSupabaseMutation('complaints');
 * await insert({ student_id: 'STU001', subject: 'Broken seat', ... });
 */
export function useSupabaseMutation(table) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const execute = useCallback(async (operation) => {
        if (!isSupabaseConfigured()) {
            setError('Supabase not configured.');
            return { data: null, error: 'Supabase not configured' };
        }

        setLoading(true);
        setError(null);

        try {
            const { data, error: opError } = await operation;
            if (opError) {
                setError(opError.message);
                console.error(`[Supabase] Mutation error on ${table}:`, opError);
                return { data: null, error: opError };
            }
            return { data, error: null };
        } catch (err) {
            setError(err.message);
            return { data: null, error: err };
        } finally {
            setLoading(false);
        }
    }, [table]);

    const insert = useCallback((row) =>
        execute(supabase.from(table).insert(row).select()),
        [table, execute]);

    const update = useCallback((match, updates) =>
        execute(supabase.from(table).update(updates).match(match).select()),
        [table, execute]);

    const remove = useCallback((match) =>
        execute(supabase.from(table).delete().match(match)),
        [table, execute]);

    return { insert, update, remove, loading, error };
}

/**
 * useSupabaseRealtime – Subscribe to real-time changes on a table.
 *
 * @param {string} table - Table name
 * @param {function} onInsert - Callback for new rows
 * @param {function} onUpdate - Callback for updated rows
 * @param {function} onDelete - Callback for deleted rows
 *
 * @example
 * useSupabaseRealtime('bus_positions', {
 *   onUpdate: (payload) => updateBusPosition(payload.new),
 * });
 */
export function useSupabaseRealtime(table, { onInsert, onUpdate, onDelete } = {}) {
    useEffect(() => {
        if (!isSupabaseConfigured()) return;

        const channel = supabase
            .channel(`realtime-${table}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table }, (payload) => {
                onInsert?.(payload);
            })
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table }, (payload) => {
                onUpdate?.(payload);
            })
            .on('postgres_changes', { event: 'DELETE', schema: 'public', table }, (payload) => {
                onDelete?.(payload);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [table, onInsert, onUpdate, onDelete]);
}
