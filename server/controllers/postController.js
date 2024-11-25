import { httpStatus } from '../utils/httpStatus.js';
import Post from '../models/postModel.js';
import User from '../models/userModel.js';

const createPost =async (req, res)=>{
    const { postedBy, text,img } = req.body;

    if(!postedBy ||!text){
        return res.status(400).json({ status: httpStatus.ERROR, message: 'posted by and text field are required' });
    }

    try {
        const user = await User.findById(postedBy);

        if(!user){
            return res.status(404).json({ status: httpStatus.ERROR, message: 'User not found' });
        }

        if(user._id.toString() !== req.user._id.toString()){
            return res.status(401).json({ status: httpStatus.ERROR, message: 'Unauthorized to create post' });
        }

        const maxLength = 500;

        if(text.length > maxLength){
            return res.status(400).json({ status: httpStatus.ERROR, message: `Text can't be more than ${maxLength} characters` });
        }

        const newPost = new Post({
            postedBy,
            text,
            img,
        });
        await newPost.save();

        res.status(201).json({ status: httpStatus.SUCCESS, data: newPost });
    } catch (error) {
        res.status(500).json({ status: httpStatus.ERROR, message: error.message });
    }
};

const getPost =async (req, res)=>{
    try {
        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({ status: httpStatus.ERROR, message: 'Post not found' });
        }

        res.json({ status: httpStatus.SUCCESS, data: post});
    } catch (error) {
        res.status(500).json({ status: httpStatus.ERROR, message: error.message });
    }
};

const deletePost =async (req, res)=>{
    try {
        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({ status: httpStatus.ERROR, message: 'Post not found' });
        }

        if(post.postedBy.toString()!== req.user._id.toString()){
            return res.status(401).json({ status: httpStatus.ERROR, message: 'Unauthorized to delete post' });
        }

        await Post.findByIdAndDelete(req.params.id);

        res.status(204).json({ status: httpStatus.SUCCESS, message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: httpStatus.ERROR, message: error.message });
    }
};

const likePost =async (req, res)=>{
    try {
        const {id:postId} = req.params;
        const userId = req.user._id;

        const post = await Post.findById(postId);

        if(!post){
            return res.status(404).json({ status: httpStatus.ERROR, message: 'Post not found' });
        }

        const userLikePost = post.likes.includes(userId);

        console.log(post)

        if(userLikePost){
            //unlike post
            await Post.updateOne({_id:postId},{$pull:{likes:userId}});
            res.status(200).json({ status: httpStatus.SUCCESS, message: 'Post unliked successfully' });
        }else{
            //like post
            post.likes.push(userId);
            await post.save();
            res.status(200).json({ status: httpStatus.SUCCESS, message: 'Post liked successfully' });
        }
    } catch (error) {
        res.status(500).json({ status: httpStatus.ERROR, message: error.message });
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
            return res.status(400).json({ status: httpStatus.ERROR, message: 'Reply text is required' });
        }

        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({ status: httpStatus.ERROR, message: 'Post not found' });
        }
        const reply = { userId, text, userProfilePic, username };
        console.log(reply)

		post.replies.push(reply);
		await post.save();

        res.status(200).json({ status: httpStatus.SUCCESS, data: reply });
    } catch (error) {
        res.status(500).json({ status: httpStatus.ERROR, message: error.message });
    }
};

const getFeedPosts =async (req, res)=>{
    try {
        const userId = req.user._id;
		const user = await User.findById(userId);


        if(!user){
            return res.status(404).json({ status: httpStatus.ERROR, message: 'User not found' });
        }

        const following = user.following;

		const feedPosts = await Post.find({ postedBy: { $in: following } });
        res.status(200).json({ status: httpStatus.SUCCESS, data: feedPosts });
    } catch (error) {
        res.status(500).json({ status: httpStatus.ERROR, message: error.message });
    }
};

export{
    createPost,
    getPost,
    deletePost,
    likePost,
    replyToPost,
    getFeedPosts
};