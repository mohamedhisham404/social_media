import express from 'express';
import dotenv from "dotenv";
import connectDB from './db/connectDB.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import {v2 as cloudinary} from 'cloudinary';
import bodyParser from 'body-parser';
import {app,server} from "./socket/socket.js"
import path from 'path'
const __dirname = path.resolve();

// it works for all of the functions
dotenv.config(); 

connectDB();

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
app.use("/api/messages",messageRoutes);

//http://localhost:3000 :=> Back,front

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname,'/client/dist')));

    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,"client","dist","index.html"))
    })
}

server.listen(PORT,()=>console.log(`listening on port ${PORT}`));
export default app;