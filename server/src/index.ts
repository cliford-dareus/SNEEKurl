import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
dotenv.config();

const app = express();

app.use(morgan('combined'));
app.use(cors());
app.use(helmet());

const PORT = process.env.PORT || 4000;

const start = async () => {
    try {
        app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
    } catch (error) {
        console.log(error);
    };
};

start();

