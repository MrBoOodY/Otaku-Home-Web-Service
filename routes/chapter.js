import express from 'express';
import { addChapter, deleteChapter, editChapter, getChapterById, getChapterList } from '../controllers/chapter_controller.js';
const router = express.Router();
router.get('/', getChapterList);
router.get('/:id', getChapterById);
router.post('/', addChapter);
router.delete('/:id', deleteChapter);
router.put('/:id', editChapter);

export default router;
