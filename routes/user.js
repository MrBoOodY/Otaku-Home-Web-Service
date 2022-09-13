import express from 'express';
import { addAnimeToMyList, addMangaToMyList, getUserByID } from '../controllers/user_controller.js';
import { verityUserJWT } from '../utils/helpers.js';
const router = express.Router();

router.get('/:id', verityUserJWT, getUserByID);
router.post('/my-anime-list/:id', (req, res) => {
    verityUserJWT(req, res, () => addAnimeToMyList(req, res), true);
});
router.post('/my-manga-list/:id', (req, res) => {
    verityUserJWT(req, res, () => addMangaToMyList(req, res), true);
});

export default router;
