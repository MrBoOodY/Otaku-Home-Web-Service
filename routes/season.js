import express from 'express';
import {   addSeason, deleteSeason, editSeason, getSeasonById, getSeasonList,     } from '../controllers/season_controller.js';
import { verityJWT } from '../utils/helpers.js';
const router = express.Router();
router.get('/', getSeasonList);
router.get('/:id', getSeasonById);
router.post('/', verityJWT, addSeason);
router.delete('/:id', verityJWT, deleteSeason);
router.put('/:id', verityJWT, editSeason);

export default router;
