import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/db.js'; 
import rateLimiter from './middleware/rateLimiter.js';
import router from './routes/transaction.js'; // Adjust the path as necessary
// Adjust the path as necessary
dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;
app.use(rateLimiter); // Apply rate limiting middleware
app.use(cors());
app.use(express.json());

app.use("/api/transactions", router);

initializeDatabase().then(() => {
app.listen(PORT, () => { 
     console.log(`Server is running on port ${PORT}`);
})
})