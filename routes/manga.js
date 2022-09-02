import express from 'express';
import { addManga, deleteManga, editManga, getMangaById, getMangaList } from '../controllers/manga_controller.js';
import { verityJWT } from '../utils/helpers.js';
const router = express.Router();
router.get('/', getMangaList);
router.get('/:id', getMangaById);
router.post('/', verityJWT, addManga);
router.delete('/:id', verityJWT, deleteManga);
router.put('/:id', verityJWT, editManga);

export default router;
