import express from "express";
import protectRoute from '../middleware/protectRoute.js';
import { createPost ,getPost ,deletePost ,likePost ,replyToPost ,getFeedPosts} from '../controllers/postController.js';


const router = express.Router();

router.get("/feed",protectRoute ,getFeedPosts);
router.get("/:id",getPost);
router.post("/create",protectRoute,createPost);
router.delete("/:id",protectRoute,deletePost);
router.post("/like/:id",protectRoute,likePost);
router.post("/reply/:id",protectRoute,replyToPost);

export default router;