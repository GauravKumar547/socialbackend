import mongoose from 'mongoose';

const connectDB = async (): Promise<typeof mongoose> => {
    try {
        const url = process.env.MONGO_URL || 'mongodb://localhost:27017/socialbackend';
        const conn = await mongoose.connect(url);
        console.log('Connected to MongoDB');
        return conn;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export default connectDB; 