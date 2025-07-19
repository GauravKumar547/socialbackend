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

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import postRoutes from './routes/posts';
import conversationRoutes from './routes/conversations';
import messageRoutes from './routes/messages';

// Load environment variables
dotenv.config();

// Initialize express app
const app: Application = express();
const server = createServer(app);

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true, // Important for cookies
}));
app.use(cookieParser());

// Session middleware - must come before routes
app.use(sessionMiddleware);

// Health check endpoint
app.get('/', (_req: Request, res: Response) => {
    res.json({ message: 'Hello its socialize backend' });
});



// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: any) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
    });
});

// 404 handler
app.use('*', (_req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
    });
});

// Start server
const PORT = process.env.PORT || 8800;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Initialize Socket.IO
initializeSocket(server);

export default app; 