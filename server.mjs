import express from 'express';
import { createServer } from 'http';
import { connectDatabase } from './config/database.js';
import dotenv from 'dotenv';
import bodyParser from "body-parser";
import cors from 'cors';
import clientRouter from './api/v1/routes/client/index.route.js';
import cookieParser from 'cookie-parser';
import { swaggerSpec, swaggerUi } from './config/swagger.js';
import { initSocket } from './config/socket.js';
import { chatEvents, notificationEvents, postEvents, friendEvents } from './api/socket/events.js';

dotenv.config();

const app = express();
const port = process.env.PORT;

const startServer = async () => {
    try {
        await connectDatabase();
        const corsOptions = {
            origin: [
                "http://localhost:3000",
                "https://vietnam-social-network.vercel.app"
            ],
            credentials: true,
            allowedHeaders: ["Content-Type", "Authorization"],
        };
        app.use(cors(corsOptions));
        app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(express.json());
        app.use(cookieParser());

        clientRouter(app);

        // Tạo HTTP server
        const httpServer = createServer(app);

        // Khởi tạo Socket.IO
        const io = initSocket(httpServer);

        // Đăng ký các sự kiện Socket.IO
        io.on('connection', (socket) => {
            // Đăng ký các sự kiện chat
            chatEvents(io, socket);

            // Đăng ký các sự kiện notification
            notificationEvents(io, socket);

            // Đăng ký các sự kiện post
            postEvents(io, socket);

            // Đăng ký các sự kiện friend
            friendEvents(io, socket);
        });

        // Khởi động server
        httpServer.listen(port, () => {
            console.log(`Backend đang chạy trên cổng ${port}`);
        });

    } catch(error) {
        console.error('Lỗi khi kết nối cơ sở dữ liệu:', error);
    }
};

startServer();
