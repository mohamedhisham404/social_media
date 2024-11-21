import Post from "../models/post.js"
import User from "../models/user.js";
import { httpStatus } from '../utils/httpStatus.js';

//create
export const createPost = async (req, res) => {
    const { userId, description, picturePath } = req.body;
   
    try {
        const user= await User.findById(userId);

        const newPost = new Post({ 
            userId, 
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            userPicturePath: user.picturePath,
            description,
            picturePath,
            likes: {},
            comments: []
        });
        await newPost.save();

        const post = await Post.find(); 
        
        res.status(201).json({ status: httpStatus.SUCCESS, data: post });
    } catch (error) {
        res.status(500).json({ status: httpStatus.ERROR, data: error });
    }
};

//read
export const getFeedPosts = async (req, res) => {
    try {
        const posts = await Post.find()

        res.status(200).json({ status: httpStatus.SUCCESS, data: posts });
    } catch (error) {
        res.status(500).json({ status: httpStatus.ERROR, data: error });
    }
};

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const posts = await Post.find({ userId });

        res.status(200).json({ status: httpStatus.SUCCESS, data: posts });
    } catch (error) {
        res.status(500).json({ status: httpStatus.ERROR, data: error });
    }
};

export const upvotePosts = async (req, res) => {
    try {
        const { id } = req.params;
        const {userId} = req.body;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);

        if(!post){
            return res.status(404).json({ status: httpStatus.ERROR, data: "Post not found" });
        }

        if(isLiked){
            post.likes.delete(userId);
        }
        else{
            post.likes.set(userId, true);
        } 

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            {likes: post.likes},
            {new: true}
        );    

        res.status(200).json({ status: httpStatus.SUCCESS, data: updatedPost });
    } catch (error) {
        res.status(500).json({ status: httpStatus.ERROR, data: error });
    }
};