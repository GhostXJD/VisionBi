import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import csvRoutes from './routes/csvDatos.routes.js';
import usuarioRoutes from './routes/usuarios.routes.js';
import companyRoutes from './routes/company.routes.js';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(morgan('dev'));
app.use(express.json())
app.use(cookieParser());

app.use("/api",authRoutes);
app.use("/api",csvRoutes);
app.use("/api",usuarioRoutes);
app.use("/api", companyRoutes) 

export default app;