import express from 'express';
import controller from '../../controllers/auth.controller.js';
import firebaseAuthMiddleware from '../../middlewares/firebase-auth.middleware.js';
const router = express.Router();

router.post('/firebase-login', firebaseAuthMiddleware, controller.firebaseLogin);
router.post('/login', controller.login);
router.post('/logout', controller.logout);
router.post('/refresh-token', controller.refreshToken);
router.get('/me', controller.me);
router.post("/register/send-otp", controller.sendOTP);
router.post("/register/verify-otp", controller.verifyOTP);
router.post("/register", controller.register);


export default router;
