import { httpStatus } from '../utils/httpStatus.js';
import User from "../models/user.js";

////////////////////////////////
//read
export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ status: httpStatus.ERROR, data: "User not found" });
        }

        res.status(200).json({ status: httpStatus.SUCCESS, data: user });
    } catch (error) {
        return res.status(500).json({ status: httpStatus.FAIL, data: error.message });
    }
};

// Get user friends
export const getUserFriends = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ status: httpStatus.ERROR, data: "User not found" });
        }

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );

        const formatedFriends = friends.map(
            ({_id, firstName, lastName, occupation,location,picturePath}) =>{
                return {_id, firstName, lastName, occupation,location,picturePath}
            }
        );

        res.status(200).json({ status: httpStatus.SUCCESS, data: formatedFriends });
    } catch (error) {
        return res.status(500).json({ status: httpStatus.FAIL, data: error.message });
    }
};

// Add or remove friend
export const addRemoveFriend = async (req, res) => {
    try {
        const { id, friendId } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ status: httpStatus.ERROR, data: "User not found" });
        }

        const friend = await User.findById(friendId);
        if (!friend) {
            return res.status(404).json({ status: httpStatus.ERROR, data: "Friend not found" });
        }

        if (user.friends.includes(friendId)) {
            user.friends = user.friends.filter((friendIdItem) => friendIdItem !== friendId);
            friend.friends = friend.friends.filter((userIdItem) => userIdItem !== id);
        } else {
            user.friends.push(friendId);
            friend.friends.push(id);
        }

        await user.save();
        await friend.save();

        const friends = await Promise.all(
            user.friends.map((friendIdItem) => User.findById(friendIdItem))
        );

        const formattedFriends = friends.map(({ _id, firstName, lastName, occupation, location, picturePath }) => {
            return { _id, firstName, lastName, occupation, location, picturePath };
        });

        res.status(200).json({ status: httpStatus.SUCCESS, data: formattedFriends });
    } catch (error) {
        return res.status(500).json({ status: httpStatus.FAIL, data: error.message });
    }
};
