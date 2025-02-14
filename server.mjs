import express from 'express';
import connectDatabase from './config/database.js';
import dotenv from 'dotenv';
import bodyParser from "body-parser";
import cors from 'cors';
import clientRouter from './api/v1/routes/client/index.route.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const port = process.env.PORT;

const startServer = async () => {
    try {
        await connectDatabase();
        const corsOptions = {
            credentials: true,
            origin: (origin, callback) => {
                const allowedOrigins = [process.env.CLIENT_ORIGIN, process.env.CLIENT_PRODUCTION_ORIGIN];
                if (allowedOrigins.includes(origin) || !origin) {
                    callback(null, true);
                } else {
                    callback(new Error('Not allowed by CORS'));
                }
            }
        };

        app.use(cors(corsOptions));
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(express.json());
        app.use(cookieParser());

        clientRouter(app);

        app.listen(port, () => {
            console.log(`Backend đang chạy trên cổng ${port}`);
        });

    } catch(error) {
        console.error('Lỗi khi kết nối cơ sở dữ liệu:', error);
    }
};

startServer();
