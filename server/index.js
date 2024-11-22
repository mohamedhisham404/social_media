import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";// middleware that read form req.body
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";//request logger middleware
import multer from "multer";
import helmet from "helmet"; //to secure http request
import path from "path";
import {fileURLToPath} from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/post.js";
import { register } from "./conrollers/auth.js";
import { createPost } from "./conrollers/posts.js";
import {verifyToken} from "./middleware/auth.js";

// CONFIG
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}))
app.use(morgan("common"));
app.use(bodyParser.json({limit:"30mb", extended:true}));
app.use(bodyParser.urlencoded({limit:"30mb", extended:true}));
app.use(cors());
app.use("/assests",express.static(path.join(__dirname,'public/assets')));

//file storage config
//when someone upload file code will store it locally
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/assets');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({storage});

//routers with files
app.post("/auth/register",upload.single("picture"),register);
app.post("/posts",verifyToken,upload.single("picture"),createPost);

//routes
app.use("/auth",authRoutes);
app.use("/users",userRoutes);
app.use("/posts",postRoutes);


//mongoose
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
  })
  .catch((err) => console.error(`MongoDB connection error: ${err}`));

