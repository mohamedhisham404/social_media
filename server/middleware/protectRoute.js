import jwt from 'jsonwebtoken';
import { httpStatus } from '../utils/httpStatus.js';
import User from "../models/userModel.js"

const protectRoute = async (req, res, next) =>{
    const authHead = req.cookies.token;
    
    if(!authHead){
        return res.status(401).json({ status: httpStatus.ERROR, message: 'Access Denied' }); 
    }

    try {
        const decoded = jwt.verify(authHead, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password")
        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({ status: httpStatus.ERROR, data: "Invalid token" });
    }
};

export default protectRoute;