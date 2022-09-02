import express from 'express';
import { addCategory, deleteCategory, editCategory, getCategoryById, getCategoryList } from '../controllers/category_controller.js';
const router = express.Router();
router.get('/', getCategoryList);
router.get('/:id', getCategoryById);
router.post('/', addCategory);
router.delete('/:id', deleteCategory);
router.put('/:id', editCategory);

export default router;
