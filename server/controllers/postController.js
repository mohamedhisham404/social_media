import { httpStatus } from '../utils/httpStatus.js';
import Post from '../models/postModel.js';
import User from '../models/userModel.js';
import {v2 as cloudinary} from 'cloudinary';

const createPost =async (req, res)=>{
    const { postedBy, text } = req.body;
    let img = req.body.img;

    if(!postedBy ||!text){
        return res.status(400).json({ status: httpStatus.ERROR, data: 'posted by and text field are required' });
    }

    try {
        const user = await User.findById(postedBy);

        if(!user){
            return res.status(404).json({ status: httpStatus.ERROR, data: 'User not found' });
        }

        if(user._id.toString() !== req.user._id.toString()){
            return res.status(401).json({ status: httpStatus.ERROR, data: 'Unauthorized to create post' });
        }

        const maxLength = 500;

        if(text.length > maxLength){
            return res.status(400).json({ status: httpStatus.ERROR, data: `Text can't be more than ${maxLength} characters` });
        }

        if(img){
			const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }

        const newPost = new Post({
            postedBy,
            text,
            img,
        });
        await newPost.save();

        res.status(201).json( newPost );
    } catch (error) {
        res.status(500).json({ status: httpStatus.ERROR, data: error.message });
    }
};

const getPost =async (req, res)=>{
    try {
        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({ status: httpStatus.ERROR, data: 'Post not found' });
        }

        res.json(post);
    } catch (error) {
        res.status(500).json({ status: httpStatus.ERROR, data: error.message });
    }
};

const deletePost =async (req, res)=>{
    try {
        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({ status: httpStatus.ERROR, data: 'Post not found' });
        }

        if(post.postedBy.toString()!== req.user._id.toString()){
            return res.status(401).json({ status: httpStatus.ERROR, data: 'Unauthorized to delete post' });
        }

        if(post.img){
            const imgId = post.img.split('/').pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({ status: httpStatus.SUCCESS, data: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: httpStatus.ERROR, data: error.message });
    }
};

const likePost =async (req, res)=>{
    try {
        const {id:postId} = req.params;
        const userId = req.user._id;

        const post = await Post.findById(postId);

        if(!post){
            return res.status(404).json({ status: httpStatus.ERROR, data: 'Post not found' });
        }

        const userLikePost = post.likes.includes(userId);

        if(userLikePost){
            //unlike post
            await Post.updateOne({_id:postId},{$pull:{likes:userId}});
            res.status(200).json({ status: httpStatus.SUCCESS, data: 'Post unliked successfully' });
        }else{
            //like post
            post.likes.push(userId);
            await post.save();
            res.status(200).json({ status: httpStatus.SUCCESS, data: 'Post liked successfully' });
        }
    } catch (error) {
        res.status(500).json({ status: httpStatus.ERROR, data: error.message });
    }
};

const replyToPost =async (req, res)=>{
    try {
        const { text } = req.body;
		const postId = req.params.id;
		const userId = req.user._id;
		const userProfilePic = req.user.profilePic;
		const username = req.user.username;

        if(!text){
            return res.status(400).json({ status: httpStatus.ERROR, data: 'Reply text is required' });
        }

        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({ status: httpStatus.ERROR, data: 'Post not found' });
        }
        const reply = { userId, text, userProfilePic, username };

		post.replies.push(reply);
		await post.save();

        res.status(200).json({ status: httpStatus.SUCCESS, data: reply });
    } catch (error) {
        res.status(500).json({ status: httpStatus.ERROR, data: error.message });
    }
};

const getFeedPosts =async (req, res)=>{
    try {
        const userId = req.user._id;
		const user = await User.findById(userId);


        if(!user){
            return res.status(404).json({ status: httpStatus.ERROR, data: 'User not found' });
        }

        const following = user.following;

		const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({ createdAt: -1 });
        res.status(200).json(feedPosts);
    } catch (error) {
        res.status(500).json({ status: httpStatus.ERROR, data: error.message });
    }
};

const getUserPosts = async (req, res)=>{
    const {username} = req.params;
    try {
        const user = await User.findOne({username})

        if(!user){
            return res.status(404).json({ status: httpStatus.ERROR, data: 'User not found' });
        }

        const posts = await Post.find({postedBy: user._id}).sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ status: httpStatus.ERROR, data: error.message });
    }
};

export{
    createPost,
    getPost,
    deletePost,
    likePost,
    replyToPost,
    getFeedPosts,
    getUserPosts
};