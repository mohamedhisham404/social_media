import express from 'express';
import {getFeedPosts, getUserPosts, upvotePosts} from "../conrollers/posts.js";
import {verifyToken} from "../middleware/auth.js";

const postRoutes = express.Router();

//read
postRoutes.get('/',verifyToken,getFeedPosts);
postRoutes.get('/:userId/',verifyToken,getUserPosts);

//update
postRoutes.patch('/:id/upvote', verifyToken, upvotePosts);

export default postRoutes;