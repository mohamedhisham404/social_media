import express from 'express';
import {getUser,getUserFriends,addRemoveFriend} from "../conrollers/users.js"
import {verifyToken} from "../middleware/auth.js";

const userRoutes = express.Router();
////////////////////////////////
//read
// Get user
userRoutes.get('/:id', verifyToken, getUser);

// Get user friends
userRoutes.get('/:id/friends', verifyToken, getUserFriends);

////////////////////////////////
//update
userRoutes.patch('/:id/:friendId', verifyToken, addRemoveFriend);


export default userRoutes;