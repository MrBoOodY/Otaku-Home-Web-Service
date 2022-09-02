import express from 'express';
import { addAnime, deleteAnime, editAnime, getAnimeById, getAnimeList } from '../controllers/anime_controller.js';
import { verityJWT } from '../utils/helpers.js';
const router = express.Router();
router.get('/', getAnimeList);
router.get('/:id', getAnimeById);
router.post('/', verityJWT, addAnime);
router.delete('/:id', verityJWT, deleteAnime);
router.put('/:id', verityJWT, editAnime);

export default router;
