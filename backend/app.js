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

export default app;