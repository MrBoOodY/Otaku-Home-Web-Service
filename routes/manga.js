import express from 'express';
import { addManga, deleteManga, editManga, getMangaById, getMangaList } from '../controllers/manga_controller.js';
const router = express.Router();
router.get('/', getMangaList);
router.get('/:id', getMangaById);
router.post('/', addManga);
router.delete('/:id', deleteManga);
router.put('/:id', editManga);

export default router;
