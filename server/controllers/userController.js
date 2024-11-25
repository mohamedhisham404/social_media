import { httpStatus } from '../utils/httpStatus.js';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import generateJWTsetCookie from '../utils/generateJWTsetCookie.js';

const getUserProfile = async(req,res) =>{
    const {username} = req.params;
    try {
        const user = await User.findOne({username}).select("-password").select("-updatedAt");
        
        if(!user){
            return res.status(404).json({ status: httpStatus.ERROR, data: 'User not found' });
        }

        res.status(200).json({ status: httpStatus.SUCCESS, data: user });
    } catch (error) {
        return res.status(500).json({ status: httpStatus.FAIL, data: error.message });
    }
};

const signupUser = async(req,res) =>{
    try {
        const {name, email,username,password} = req.body;
        const user = await User.findOne({$or:[{ email},{username}]});

        if(user){
            return res.status(400).json({ status: httpStatus.ERROR, data: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({name,email,username,password:hashedPassword});
        await newUser.save();

        if(newUser){
            const token = await generateJWTsetCookie(newUser._id, res);
            res.status(201).json({ status: httpStatus.SUCCESS, data: newUser });
        }else{
            res.status(400).json({ status: httpStatus.ERROR, data: 'Failed to create user' });
        }

    } catch (error) {
        return res.status(500).json({ status: httpStatus.FAIL, data: error.message });
    }
};

const loginUser = async(req,res) =>{
    try {
        const {username, password} = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ status: httpStatus.ERROR, data: 'Invalid Email or Password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(404).json({ status: httpStatus.ERROR, data: 'Invalid Email or Password' });
        }

        generateJWTsetCookie(user._id, res);
        res.json({ status: httpStatus.SUCCESS, data: user });

    } catch (error) {
        return res.status(500).json({ status: httpStatus.FAIL, data: error.message });
    }
};

const logoutUser = (req,res) =>{
    try {
        res.clearCookie('token',"",{maxAge:1});
        res.json({ status: httpStatus.SUCCESS, data: "loged out" });
    } catch (error) {
        return res.status(500).json({ status: httpStatus.FAIL, data: error.message });
    }
};

const followUnfollowUser = async(req,res) =>{
    try {
        const { id } = req.params;
		const userToModify = await User.findById(id);
		const currentUser = await User.findById(req.user._id);

		if (id === req.user._id.toString())
            return res.status(404).json({ status: httpStatus.ERROR, data: "you can not follow or unfollow yourself" });

        if (!userToModify ||!currentUser)
            return res.status(404).json({ status: httpStatus.ERROR, data: 'User not founed' });

		if (!userToModify || !currentUser) 
            return res.status(404).json({ status: httpStatus.ERROR, data: 'User not founed' });

		const isFollowing = currentUser.following.includes(id);

		if (isFollowing) {
			// Unfollow user
			await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
            res.status(200).json({status: httpStatus.SUCCESS ,data: "User unfollowed successfully" });
        } else {
			// Follow user
			await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
			res.status(200).json({ status: httpStatus.SUCCESS,message: "User followed successfully" });
		}
    } catch (error) {
        return res.status(500).json({ status: httpStatus.FAIL, data: error.message });
    }
};

const updateUser = async(req,res) =>{
    const { name, email, username, password,bio,profilePic } = req.body;
    const userId = req.user._id;

    try {
        let user = await User.findById(userId);

        if (!user)
            return res.status(404).json({ status: httpStatus.ERROR, data: 'User not found' });


		if (req.params.id !== userId.toString())
			return res.status(400).json({ error: "You cannot update other user's profile" });

        if(password){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user.password = hashedPassword;
        }

        user.name = name || user.name;
		user.email = email || user.email;
		user.username = username || user.username;
		user.profilePic = profilePic || user.profilePic;
		user.bio = bio || user.bio;

		user = await user.save();

        res.json({ status: httpStatus.SUCCESS, data: user });

    } catch (error) {
        return res.status(200).status(500).json({ status: httpStatus.FAIL, data: error.message });
    }
};

export {signupUser ,loginUser ,logoutUser, followUnfollowUser, updateUser,getUserProfile};