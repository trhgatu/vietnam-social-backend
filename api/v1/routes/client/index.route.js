import postRoutes from "./post.route.js";
import authRoutes from "./auth.route.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";
const clientRouter = (app) => {
    const version = "/api/v1";
    // Routes cho user
    app.use(version + "/posts", postRoutes);
    app.use(version + "/auth", authRoutes);
};

export default clientRouter;
