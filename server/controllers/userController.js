import { httpStatus } from '../utils/httpStatus.js';
import User from '../models/userModel.js';
import Post from '../models/postModel.js';
import bcrypt from 'bcryptjs';
import generateJWTsetCookie from '../utils/generateJWTsetCookie.js';
import {v2 as cloudinary} from 'cloudinary';
import mongoose from 'mongoose';

const getUserProfile = async(req,res) =>{
    const {query} = req.params;
    try {
        let user;
        
        if(mongoose.Types.ObjectId.isValid(query)){
            user = await User.findOne({_id:query}).select("-password").select("-updatedAt");
        }else{
            user = await User.findOne({username:query}).select("-password").select("-updatedAt");
        }
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

        if(! name || ! email || ! username || ! password){
            return res.status(400).json({ status: httpStatus.ERROR, data: 'All fields are required' });
        }

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

        if(!username || !password){
            return res.status(400).json({ status: httpStatus.ERROR, data: 'Username and Password are required' });
        }

        if(user.isFrozen){
            user.isFrozen = false;
            await user.save();
        }

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
			res.status(200).json({ status: httpStatus.SUCCESS,data: "User followed successfully" });
		}
    } catch (error) {
        return res.status(500).json({ status: httpStatus.FAIL, data: error.message });
    }
};

const updateUser = async(req,res) =>{
    const { name, email, username, password,bio } = req.body;
    let profilePic = req.body.profilePic;
    const userId = req.user._id;

    try {
        let user = await User.findById(userId);

        if (!user)
            return res.status(404).json({ status: httpStatus.ERROR, data: 'User not found' });


		if (req.params.id !== userId.toString())
			return res.status(400).json({  status: httpStatus.ERROR,data: "You cannot update other user's profile" });

        if(password){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user.password = hashedPassword;
        }

        const existingUser = await User.findOne({ username: req.body.username });
        if (existingUser && existingUser._id.toString() !== req.user._id.toString()) {
            return res.status(400).json({
                status: httpStatus.FAIL,
                data: `The username "${req.body.username}" is already taken. Please choose a different one.`,
            });
        }

        if (profilePic) {
            // console.log("ProfilePic type:", typeof profilePic, "Value:", profilePic);
			if (user.profilePic) {
				await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
			}

			const uploadedResponse = await cloudinary.uploader.upload(profilePic);
			profilePic = uploadedResponse.secure_url;
		}

        user.name = name || user.name;
		user.email = email || user.email;
		user.username = username || user.username;
        user.profilePic = profilePic || user.profilePic
		user.bio = bio || user.bio;

		user = await user.save();

        await Post.updateMany(
			{ "replies.userId": userId },
			{
				$set: {
					"replies.$[reply].username": user.username,
					"replies.$[reply].userProfilePic": user.profilePic,
				},
			},
			{ arrayFilters: [{ "reply.userId": userId }] }
		);

        user.password=null;

        res.json({ status: httpStatus.SUCCESS, data: user });

    } catch (error) {
        return res.status(500).json({ status: httpStatus.FAIL, data: error.message });
    }
};

const getSuggetedUsers = async(req,res) =>{
    try {
		const userId = req.user._id;

		const usersFollowedByYou = await User.findById(userId).select("following");

		const users = await User.aggregate([
			{
				$match: {
					_id: { $ne: userId },
				},
			},
			{
				$sample: { size: 10 },
			},
		]);
		const filteredUsers = users.filter((user) => !usersFollowedByYou.following.includes(user._id));
		const suggestedUsers = filteredUsers.slice(0, 4);

		suggestedUsers.forEach((user) => (user.password = null));

		res.status(200).json(suggestedUsers);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const freezAccount = async(req,res) =>{
    try {
		const user = await User.findById(req.user._id);
		if (!user) {
			return res.status(400).json({ error: "User not found" });
		}

		user.isFrozen = true;
		await user.save();

		res.status(200).json({ success: true });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}

export {signupUser,freezAccount ,loginUser ,logoutUser, followUnfollowUser, updateUser,getUserProfile,getSuggetedUsers};