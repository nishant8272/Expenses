import express from 'express';
const router = express.Router();
import {postTransaction,getTransactionsByUserId,deleteTransaction,getTransactionSummary} from '../controllers.js/transactoncontroller.js';



router.post("/", postTransaction); 
router.get("/:userId", getTransactionsByUserId); 
router.delete("/:id", deleteTransaction);
router.get("/summary/:userId", getTransactionSummary);


export default router;