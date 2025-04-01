import express from 'express';
import controller from '../../controllers/post.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
const router = express.Router();

router.get('/', controller.index);
router.post('/create', authMiddleware, controller.create)
router.get('/user/:username', controller.getPostsByUsername);
export default router;
