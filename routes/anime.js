import express from 'express';
import { addAnime, addContentCategoryToAnime, addRateToAnime, deleteAnime, editAnime, getAnimeById, getAnimeList } from '../controllers/anime_controller.js';
import { verityJWT, verityJWTWithId } from '../utils/helpers.js';
const router = express.Router();
router.get('/', getAnimeList);
router.get('/:id', getAnimeById);
router.post('/', verityJWT, addAnime);
router.post('/rate/:id', (req, res) => {
    verityJWTWithId(req, res, () => addRateToAnime(req, res), true);
});
router.post('/content-category/:id', (req, res) => {
    verityJWTWithId(req, res, () => addContentCategoryToAnime(req, res), true);
});
router.delete('/:id', verityJWT, deleteAnime);
router.put('/:id', verityJWT, editAnime);

export default router;
