import express from 'express';
import { addContentCategory, deleteContentCategory, editContentCategory, getContentCategoryById, getContentCategoryList } from '../controllers/content_category_controller.js';
import { verityJWT } from '../utils/helpers.js';
const router = express.Router();
router.get('/', getContentCategoryList);
router.get('/:id', getContentCategoryById);
router.post('/', verityJWT, addContentCategory);
router.delete('/:id', verityJWT, deleteContentCategory);
router.put('/:id', verityJWT, editContentCategory);

export default router;
