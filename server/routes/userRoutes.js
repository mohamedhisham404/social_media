import express from "express";
import { signupUser,getSuggetedUsers,loginUser,logoutUser, followUnfollowUser, updateUser ,getUserProfile} from '../controllers/userController.js';
import protectRoute from '../middleware/protectRoute.js';

const router = express.Router();

router.get('/profile/:query',getUserProfile);
router.get('/suggested',protectRoute,getSuggetedUsers);
router.post('/signup',signupUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/follow/:id', protectRoute,followUnfollowUser);
router.put('/update/:id', protectRoute,updateUser);

export default router;