import express from 'express';
import { addEpisode, deleteEpisode, editEpisode, getEpisodeById, getEpisodeList } from '../controllers/episode_controller.js';
const router = express.Router();
router.get('/', getEpisodeList);
router.get('/:id', getEpisodeById);
router.post('/', addEpisode);
router.delete('/:id', deleteEpisode);
router.put('/:id', editEpisode);

export default router;
