import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import csvRoutes from './routes/csvDatos.routes.js';
import usuarioRoutes from './routes/usuarios.routes.js';
import companyRoutes from './routes/company.routes.js';
import goalRoutes from './routes/goal.routes.js'

const app = express();

// Define __dirname en el ámbito del módulo principal
const __dirname = new URL(import.meta.url).pathname;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(morgan('dev'));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api",authRoutes);
app.use("/api",csvRoutes);
app.use("/api",usuarioRoutes);
app.use("/api", companyRoutes);
app.use("/api", goalRoutes);

export default app;