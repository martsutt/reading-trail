import { createClient } from '@supabase/supabase-js';

const clientOptions = {
    auth: { persistSession: false, autoRefreshToken: false },
};

export async function requireGuest(req, res, next) {
    const match = req.get('authorization')?.match(/^Bearer\s+(\S+)$/i);

    if (!match) {
        return res.status(401).json({ error: 'Access token required' });
    }

    const token = match[1];

    try {
        const authClient = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_PUBLISHABLE_KEY,
            clientOptions
        );

        const { data, error } = await authClient.auth.getUser(token);

        if (error || !data.user) {
            return res.status(401).json({ error: 'Invalid access token' });
        }

        req.user = data.user;

        req.db = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_PUBLISHABLE_KEY,
            {
                ...clientOptions,
                global: { headers: { Authorization: `Bearer ${token}` } },
            }
        );

        next();
    } catch (error) {
        next(error);
    }
}