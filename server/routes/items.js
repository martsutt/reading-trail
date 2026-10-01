import { Router } from 'express';
import { validateItem } from '../validation.js';
import { requireGuest } from '../middleware/requireGuest.js';

const router = Router();

router.use(requireGuest);

router.get('/', async (req, res, next) => {
    try {
        const { data, error } = await req.db
            .from('items')
            .select('*')
            .eq('owner_id', req.user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    const result = validateItem(req.body);

    if (result.error) {
        return res.status(400).json({ error: result.error });
    }

    try {
        const { data, error } = await req.db
            .from('items')
            .insert({ ...result.value, owner_id: req.user.id })
            .select()
            .single();

        if (error) throw error;

        res.status(201).json(data);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const { data, error } = await req.db
            .from('items')
            .delete()
            .eq('id', req.params.id)
            .eq('owner_id', req.user.id)
            .select();

        if (error?.code === '22P02') {
            return res.status(404).json({ error: 'Item not found' });
        }
        if (error) throw error;

        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }

        res.status(204).end();
    } catch (error) {
        next(error);
    }
});

export default router;