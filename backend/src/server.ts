import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import motasRoutes from './routes/motas.routes';
import pecasRoutes from './routes/pecas.routes';
import equipasRoutes from './routes/equipas.routes';
import pilotosRoutes from './routes/pilotos.routes';
import stockRoutes from './routes/stock.routes';
import pedidosRoutes from './routes/pedidos.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rota de teste para verificar se o servidor está a funcionar
app.get('/', (req, res) => {
  res.json({ message: 'PaddockShare API running'});
});

app.use('/api/motas', motasRoutes);
app.use('/api/pecas', pecasRoutes);
app.use('/api/equipas', equipasRoutes);
app.use('/api/pilotos', pilotosRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/pedidos', pedidosRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});

export default app;