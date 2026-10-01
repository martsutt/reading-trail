import express from 'express';
import cors from 'cors';
import itemsRouter from './routes/items.js';

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));


app.use(express.json({ limit: '10kb' }));

app.use('/api/items', itemsRouter);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'Invalid JSON' });
    }

    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
});

export default app;