import express from 'express';
import controller from '../../controllers/admin/post-category.controller.js';
const router = express.Router();

router.get('/', controller.index);

export default router;
