import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { coonectDB } from './lib/db.js';
import authRoutes from './routes/auth.route.js'

dotenv.config();

const app = express();

app.use(express.json()); // it reads the json client informatin

app.use(cookieParser()); // it parses the cookie
app.use(cors()); 

const PORT = process.env.PORT || 5000;

app.listen(PORT, (req, res)=>{
    console.log(`Server is running on port ${PORT}`);
    coonectDB();

})

app.use('/api/v1/auth', authRoutes);