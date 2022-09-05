import express from 'express';
import { addEpisodeReleaseDay, deleteEpisodeReleaseDay, editEpisodeReleaseDay, getEpisodeReleaseDayById, getEpisodeReleaseDayList } from '../controllers/episode_release_day_controller.js';
import { verityJWT } from '../utils/helpers.js';
const router = express.Router();
router.get('/', getEpisodeReleaseDayList);
router.get('/:id', getEpisodeReleaseDayById);
router.post('/', verityJWT, addEpisodeReleaseDay);
router.delete('/:id', verityJWT, deleteEpisodeReleaseDay);
router.put('/:id', verityJWT, editEpisodeReleaseDay);

export default router;
