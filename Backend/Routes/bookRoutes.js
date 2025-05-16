import { Router } from "express";
import bookController from "../Controllers/bookController.js";


const router=Router();

router.post('/api/postBook',bookController.postBook)
router.get('/api/getBooks',bookController.getBooks)




export default router;