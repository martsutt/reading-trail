import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);


let sessionPromise = null;

export function ensureGuestSession() {
    if (!sessionPromise) {
        sessionPromise = (async () => {
            const { data, error } = await supabase.auth.getSession();

            if (error) throw error;
            if (data.session) return data.session;

            const result = await supabase.auth.signInAnonymously();

            if (result.error) throw result.error;
            if (!result.data.session) throw new Error('Guest session unavailable');

            return result.data.session;
        })().catch((err) => {
            sessionPromise = null;
            throw err;
        });
    }

    return sessionPromise;
}