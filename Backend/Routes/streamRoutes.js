import { Router } from "express";
import liveStremController from "../Controllers/liveStremController.js";
import { authMiddleware } from "../Middleware/authMiddleware.js";


const router=Router();

router.get('/api/token',authMiddleware,liveStremController.generateToken);


export default router;