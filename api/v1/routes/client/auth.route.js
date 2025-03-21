import express from 'express';
import controller from '../../controllers/auth.controller.js';
import firebaseAuthMiddleware from '../../middlewares/firebase-auth.middleware.js';
const router = express.Router();

router.post('/firebase-login', firebaseAuthMiddleware, controller.firebaseLogin);
router.post('/login', controller.login);
router.post('/logout', controller.logout);
router.get('/me', controller.me);

export default router;
