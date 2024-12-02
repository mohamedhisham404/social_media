import mongoose from "mongoose";

// Define the schema for a reply
const replySchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    text: {
      type: String,
      required: true,
    },
    userProfilePic: {
      type: String,
    },
    username: {
      type: String,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

// Define the schema for a post
const postSchema = new mongoose.Schema(
  {
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      maxLength: 500,
    },
    img: {
      type: String,
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    replies: [replySchema], // Use the reply schema
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt to the post
);

const Post = mongoose.model('Post', postSchema);

export default Post;
