import express from 'express';
import { register, login, getMe, verifyOTP, sendOTP,  } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/send-otp', sendOTP)
router.post('/verify-otp', verifyOTP)

// Private routes
router.get('/me', protect, getMe);

export default router;