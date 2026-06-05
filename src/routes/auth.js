import express from 'express';
import { register, login } from '../controllers/authController.js';
import { validateRegistration } from '../middleware/validation.js';

const router = express.Router();

router.post('/register', validateRegistration, register);
router.post('/login', login);

export default router;