import { Router } from "express";
import { authMiddleware } from "../Middleware/authMiddleware.js";
import activateController from "../Controllers/activateController.js";

const router=Router();

router.post('/api/activate-user',authMiddleware,activateController.activate);



export default router;