import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import connectDB from './db/connect';
dotenv.config();

import authRouter from './routes/auth';

import notfoundMiddleware from './middlewares/NotFound';
import errorHandlerMiddleware from './middlewares/errorHandler';

const app = express();

app.use(morgan('combined'));
app.use(cors());
app.use(helmet());
app.use(express.urlencoded({ extended: false }))
app.use(express.json());

app.use('/api/v1/auth', authRouter);

//custom middleware
app.use(notfoundMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 4000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI!)
        app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
    } catch (error) {
        console.log(error);
    };
};

start();

