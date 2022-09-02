import express from 'express';
import { register, login, getUserList, verityJWT } from '../controllers/auth_controller.js';
const router = express.Router();
router.get('/', verityJWT, getUserList);
router.post('/login', login);
router.post('/register', register);/* 
router.post('/', addUser);
router.delete('/:id', deleteUser);
router.put('/:id', editUser); */

export default router;
