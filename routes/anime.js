import express from 'express';
import { addAnime, deleteAnime, editAnime, getAnimeById, getAnimeList } from '../controllers/anime_controller.js';
const router = express.Router();
router.get('/', getAnimeList);
router.get('/:id', getAnimeById);
router.post('/', addAnime);
router.delete('/:id', deleteAnime);
router.put('/:id', editAnime);

export default router;
