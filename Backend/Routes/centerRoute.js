import { Router } from "express";
import centerController from "../Controllers/centerController.js";


const router=Router();

router.post('/api/postCenter',centerController.postCenter)
router.get('/api/getCenters',centerController.getCenters)


export default router;