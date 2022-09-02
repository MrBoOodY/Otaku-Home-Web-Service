import express from 'express';
import { addCategory, deleteCategory, editCategory, getCategoryById, getCategoryList } from '../controllers/category_controller.js';
import { verityJWT } from '../utils/helpers.js';
const router = express.Router();
router.get('/', getCategoryList);
router.get('/:id', getCategoryById);
router.post('/', verityJWT, addCategory);
router.delete('/:id', verityJWT, deleteCategory);
router.put('/:id', verityJWT, editCategory);

export default router;
