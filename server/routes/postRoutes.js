import express from "express";
import protectRoute from '../middleware/protectRoute.js';
import { createPost ,getPost,getUserPosts ,deletePost ,likePost ,replyToPost ,getFeedPosts} from '../controllers/postController.js';


const router = express.Router();

router.get("/feed",protectRoute ,getFeedPosts);
router.get("/:id",getPost);
router.get("/user/:username",getUserPosts);
router.post("/create",protectRoute,createPost);
router.delete("/:id",protectRoute,deletePost);
router.put("/like/:id",protectRoute,likePost);
router.put("/reply/:id",protectRoute,replyToPost);

export default router;