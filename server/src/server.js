import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoute from './routes/auth.routes.js';
import connectDB from './database/db_connection.js';
const app = express();

dotenv.config();
connectDB();

app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoute);


const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running at port no: ${PORT}`)
});