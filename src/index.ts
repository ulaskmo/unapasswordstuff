import express from 'express';
import dotenv from 'dotenv';
import { connectToDatabase } from './database';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';

dotenv.config();
const app = express();

app.use(express.json());

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);

connectToDatabase().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
  });
});
