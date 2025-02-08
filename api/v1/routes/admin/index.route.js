import authRoutes from "./auth.route.js";
import userRoutes from "./user.route.js";
import dashboardRoutes from "./dashboard.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const adminRoutes = (app) => {
    const version = "/api/v1/admin";
    app.use(version + "/dashboard", dashboardRoutes);
    app.use(version + "/users", userRoutes);
    app.use(version + "/auth", authRoutes);
};

export default adminRoutes;
