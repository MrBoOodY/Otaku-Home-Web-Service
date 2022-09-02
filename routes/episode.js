import express from 'express';
import { addEpisode, deleteEpisode, editEpisode, getEpisodeById, getEpisodeList } from '../controllers/episode_controller.js';
import { verityJWT } from '../utils/helpers.js';
const router = express.Router();
router.get('/', getEpisodeList);
router.get('/:id', getEpisodeById);
router.post('/', verityJWT, addEpisode);
router.delete('/:id', verityJWT, deleteEpisode);
router.put('/:id', verityJWT, editEpisode);

export default router;
