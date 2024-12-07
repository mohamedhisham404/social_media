import express from 'express';
import dotenv from "dotenv";
import connectDB from './db/connectDB.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import {v2 as cloudinary} from 'cloudinary';
import bodyParser from 'body-parser';

// it works for all of the functions
dotenv.config(); 

connectDB();

const app= express();

const PORT = process.env.PORT || 5000;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

//middlewares
app.use(express.urlencoded({ extended: true }));//to parse from data to req.body
app.use(bodyParser.json({limit: '50mb'}));
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/users",userRoutes);
app.use("/api/posts",postRoutes);
app.use("/api/message",messageRoutes);


app.listen(PORT,()=>console.log(`listening on port ${PORT}`));