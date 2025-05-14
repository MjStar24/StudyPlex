import { Router } from "express";
import authController from "../Controllers/authController.js";

const router=Router();

router.post('/api/send-otp',authController.sendOtp);
router.post('/api/verify-otp',authController.verifyOtp);
router.get('/api/refresh',authController.refresh);


export default router;