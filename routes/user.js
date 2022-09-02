import express from 'express';
import { getUserByID } from '../controllers/user_controller.js';
import { verityUserJWT } from '../utils/helpers.js';
const router = express.Router();

router.get('/fetch/:id', verityUserJWT, getUserByID);


export default router;
