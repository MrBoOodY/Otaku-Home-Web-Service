import express from 'express';
import { register, login, getAllAccounts, deleteAccount, editAccount, forget, authMe } from '../controllers/auth_controller.js';
import { verityUserJWT } from '../utils/helpers.js';
import rateLimit from 'express-rate-limit';
const limit = rateLimit({
    max: 5, // number of chances
    windowMs: 15 * 60 * 1000, // 15 Minutes of 'ban'  
    message: 'Too many requests, please try again later.' // message to send
});
const router = express.Router();
router.get('/', verityUserJWT, getAllAccounts);
router.post('/login', limit, login);
router.post('/social', limit, (req, res) => {
    req.params.isSocial = true;
    register(req, res);
});
router.post('/register', limit, register);
router.post('/forget', limit, forget);
//Get Two Factor Authentication Base 32
router.get('/authMe', /* limit, */ authMe);
router.delete('/:id', verityUserJWT, deleteAccount);
router.put('/:id', verityUserJWT, editAccount);


export default router;
