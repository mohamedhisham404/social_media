import express from 'express';
import dotenv from "dotenv";
import connectDB from './db/connectDB.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';

// it works for all of the functions
dotenv.config(); 

connectDB();

const app= express();

const PORT = process.env.PORT || 5000;

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));//to parse from data to req.body
app.use(cookieParser());

// routes
app.use("/api/users",userRoutes);
app.use("/api/posts",postRoutes);


app.listen(PORT,()=>console.log(`listening on port ${PORT}`));