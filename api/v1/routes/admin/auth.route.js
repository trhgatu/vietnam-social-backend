import express from 'express';
import controller from '../../controllers/admin/auth.controller.js';
/* import { loginPost } from '../../validates/auth.validate.js'; */
import { verifyToken } from '../../middlewares/auth.middleware.js';
const router = express.Router();

/*
router.post('/login', loginPost, controller.login);
router.get('/profile', requireAuth, controller.me);
router.post('/logout', requireAuth, controller.logout); */

export default router;
