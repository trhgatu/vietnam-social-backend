import express from 'express';
import controller from '../../controllers/client/post.controller.js';
import { verifyToken } from '../../middlewares/auth.middleware.js';
const router = express.Router();

router.get('/', controller.index);

export default router;
