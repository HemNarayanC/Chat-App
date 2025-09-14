import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import authRoute from './routes/auth.routes.js';
import messageRoute from './routes/message.routes.js'
import connectDB from './database/db_connection.js';
import { app, server } from './lib/socket.js';

import path from "path";
const __dirname = path.resolve();

connectDB();

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.use('/api/auth', authRoute);
app.use('/api/messages', messageRoute)

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../../frontend/dist")));

    app.get("/*", (req, res) => {
        res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
    })
}

const PORT = process.env.PORT;

server.listen(PORT, () => {
    console.log(`Server running at port no: ${PORT}`)
});