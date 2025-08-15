import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import connectDB from './config/database';
import { initializeSocket } from './config/socket';
import { sessionMiddleware } from './middleware/sessionMiddleware';
import { handleError } from './utils/errorHandler';

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import postRoutes from './routes/posts';
import conversationRoutes from './routes/conversations';
import messageRoutes from './routes/messages';
import { initializeCronJob } from './utils/cronJob';

dotenv.config();

const app: Application = express();
const server = createServer(app);

app.set('trust proxy', 1);

connectDB();

app.use(express.json());
app.use(helmet());
app.use(morgan('common'));
app.use(cors({
    origin: (process.env.FRONTEND_URL || '').split(',').map((o) => o.trim()).filter(Boolean).length
        ? (process.env.FRONTEND_URL as string).split(',').map((o) => o.trim())
        : process.env.FRONTEND_URL || true,
    credentials: true, // Important for cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(cookieParser());

app.use(sessionMiddleware);

app.get('/', (_req: Request, res: Response) => {
    res.json({ message: 'Hello its socialize backend' });
});



app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);

app.use((err: Error, _req: Request, res: Response, _next: any) => {
    handleError(err, res);
});

app.use('*', (_req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
    });
});

const PORT = process.env.PORT || 8800;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

initializeSocket(server);

initializeCronJob();

export default app; 