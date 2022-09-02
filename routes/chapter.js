import express from 'express';
import { addChapter, deleteChapter, editChapter, getChapterById, getChapterList } from '../controllers/chapter_controller.js';
import { verityJWT } from '../utils/helpers.js';
const router = express.Router();
router.get('/', getChapterList);
router.get('/:id', getChapterById);
router.post('/', verityJWT, addChapter);
router.delete('/:id', verityJWT, deleteChapter);
router.put('/:id', verityJWT, editChapter);

export default router;
