import express from 'express';
import connectDatabase from './config/database.js';
import dotenv from 'dotenv';
import bodyParser from "body-parser";
import cors from 'cors';
import adminRoutes from './api/v1/routes/admin/index.route.js';
import clientRouter from './api/v1/routes/client/index.route.js';
import cookieParser from 'cookie-parser';
import prefixAdmin  from './config/system.js';

dotenv.config();

const app = express();
const port = process.env.PORT;

const startServer = async () => {
    try {
        await connectDatabase();
        app.use(cors({
            origin: process.env.CLIENT_ORIGIN,
        }));
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(express.json());
        app.use(cookieParser());

        app.locals.prefixAdmin = prefixAdmin;

        adminRoutes(app);
        clientRouter(app);

        app.listen(port, () => {
            console.log(`Backend đang chạy trên cổng ${port}`);
        });

    } catch(error) {
        console.error('Lỗi khi kết nối cơ sở dữ liệu:', error);
    }
};

startServer();
