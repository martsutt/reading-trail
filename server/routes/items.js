import { Router } from 'express';
import { validateItem } from '../validation.js';

const router = Router();

router.get('/', (req, res) => {
    res.status(200).json([]);
});

router.post('/', (req, res) => {
    const result = validateItem(req.body);

    if (result.error) {
        return res.status(400).json({ error: result.error });
    }

    res.status(201).json(result.value);
});

router.delete('/:id', (req, res) => {
    res.status(204).end();
});

export default router;