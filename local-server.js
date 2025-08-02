import express from 'express';
import cors from 'cors'; // Если установлен как ES-модуль

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

import handler from './api/resize.js';

app.post('/api/resize', async (req, res) => {
  console.log('Получен запрос:', req.body);
  await handler(req, res);
});

const PORT = 3000;
app.listen(3000, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}/api/resize`);
});