import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import motasRoutes from './routes/motas.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

//confirmar que o servidor está vivo
app.get('/', (req, res) => {
  res.json({ message: 'PaddockShare API running',});
});

app.use('/api/motas', motasRoutes);

app.listen(PORT, () => {
  console.log(`Server running on porrt: ${PORT}`);
});

export default app;