import { httpStatus } from '../utils/httpStatus.js';
import Conversation from '../models/convesationModel.js';
import Message from '../models/messageModel.js';
import { getRecipientSocketsId } from '../socket/socket.js';
import { io } from '../socket/socket.js';
import {v2 as cloudinary} from 'cloudinary';

const sendMessage =async (req, res)=>{
    try {
        const {recipientId, message} =req.body;
        let {img} = req.body;
        const senderId = req.user._id;
        let conversation = await Conversation.findOne({
            participants :{$all :[senderId ,recipientId]}
        })

        if(!conversation){
            conversation = new Conversation({
                participants : [senderId, recipientId],
                lastMessage : {sender:senderId, text:message}
            });
            await conversation.save();
        }

        if(img){
            const uploadedResponse = await cloudinary.uploader.upload(img)
            img = uploadedResponse.secure_url
        }

        const newMessage = new Message({
            sender: senderId,
            conversationId : conversation._id,
            text: message,
            img: img || ""
        })
        
        await Promise.all([
            newMessage.save(),
            Conversation.updateOne({
                lastMessage:{
                    text: message,
                    sender: senderId,
                }
            })
        ])

        const recipientSocketsId = getRecipientSocketsId(recipientId)
        if(recipientSocketsId){
            io.to(recipientSocketsId).emit("newMessage",newMessage)
        }

        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ status: httpStatus.ERROR, data: error.message });
    }
};

const getMessages =async (req, res)=>{
    const {otherUserId} = req.params;
    const userId = req.user._id;
    try {
        let conversation = await Conversation.findOne({
            participants :{$all :[userId ,otherUserId]}
        });

        if(!conversation){
            return res.status(404).json({ status: httpStatus.ERROR, data: 'Conversation not found' });
        }

        const messages = await Message.find({
            conversationId: conversation._id
        }).sort({createdAt:1});

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ status: httpStatus.ERROR, data: error.message });
    }
};

const getConversations =async (req, res)=>{
    const userId = req.user._id;
    try {
        const conversations = await Conversation.find({participants: userId}).populate({
            path: 'participants',
            select: 'username profilePic'
        })
        conversations.forEach(conversation =>{
            conversation.participants = conversation.participants.filter(
                participant => participant._id.toString()!== userId.toString()
            )
        })
        res.status(200).json(conversations)
    } catch (error) {
        res.status(500).json({ status: httpStatus.ERROR, data: error.message });
    }
};


export{
    sendMessage,
    getMessages,
    getConversations
};