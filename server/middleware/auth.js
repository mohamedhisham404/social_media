import jwt from 'jsonwebtoken';
import { httpStatus } from '../utils/httpStatus.js';

export const verifyToken = async (req, res, next) =>{
    const authHead = req.headers['Authorization'] || req.headers['authorization']
    
    if(!authHead || !authHead.startsWith('Bearer ')){
        return res.status(401).json({ status: httpStatus.ERROR, message: 'Access Denied' }); 
    }
   
    const token = authHead.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ status: httpStatus.ERROR, data: "Invalid token" });
    }
}