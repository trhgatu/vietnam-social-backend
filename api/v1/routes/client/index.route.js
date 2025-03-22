import postRoutes from "./post.route.js";
import authRoutes from "./auth.route.js";
import aiRoutes from "./ai.route.js";
import userRoutes from "./user.route.js"
import spotifyRoutes from './spotify.route.js'
import friendShipRoutes from './friendship.route.js'

const clientRouter = (app) => {
    const version = "/api/v1";
    app.use(version + "/posts", postRoutes);
    app.use(version + "/auth", authRoutes);
    app.use(version + "/ai", aiRoutes);
    app.use(version + "/users", userRoutes);
    app.use(version + "/spotify", spotifyRoutes)
    app.use(version + "/friends", friendShipRoutes)
};

export default clientRouter;
