import express from 'express';
import { register, login, getAllAccounts, deleteAccount, editAccount } from '../controllers/auth_controller.js';
import { verityUserJWT } from '../utils/helpers.js';
const router = express.Router();
router.get('/', verityUserJWT, getAllAccounts);
router.post('/login', login);
router.post('/register', register);
router.delete('/:id', verityUserJWT, deleteAccount);
router.put('/:id', verityUserJWT, editAccount);


export default router;
