import bcrypt from 'bcrypt';
import User from "../models/user.js";
import { httpStatus } from '../utils/httpStatus.js';
import {generateJWT} from '../utils/generateJWT.js';

// Register a new user
export const register = async (req, res) => {
    const {firstName, lastName, email, password, picturePath, location, occupation} = req.body;
    const salt = await bcrypt.genSalt();

    try {
        const oldUser = await User.findOne({ email });
        if (oldUser) {
            return res.status(400).json({ status: httpStatus.ERROR, message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({firstName, lastName, email, password: hashedPassword, picturePath, location, occupation });
        const token = await generateJWT({email: newUser.email, password: newUser.password, id: newUser._id});
        await newUser.save();
        
        newUser.token = token; 
        await newUser.save();

        const { password: _, ...userWithoutPassword } = newUser.toObject();


        res.status(201).json({ status: httpStatus.SUCCESS, data: { userWithoutPassword } });
    } catch (error) {
        return res.status(500).json({ status: httpStatus.FAIL, data: error.message });
    }
};

// Login a user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ status: httpStatus.ERROR, data: "Please provide email and password" });
        }

        const logeduser = await User.findOne({ email });
        if (!logeduser) {
            return res.status(401).json({ status: httpStatus.ERROR, data: "Wrong email or password" });
        }

        const isMatch = await bcrypt.compare(password, logeduser.password);
        if (!isMatch) {
            return res.status(401).json({ status: httpStatus.ERROR, data: "Wrong email or password" });
        }

        const token = await generateJWT({email: logeduser.email, password: logeduser.password, id: logeduser._id});

        const { password: _, ...userWithoutPassword } = logeduser.toObject();

        res.status(200).json({ status: httpStatus.SUCCESS, data: { token: token, user: userWithoutPassword } });
    } catch (error) {
        return res.status(500).json({ status: httpStatus.FAIL, data: error.message });
    }
};

