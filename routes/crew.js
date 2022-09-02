import express from 'express';
import { addCrew, deleteCrew, editCrew, getCrewById, getCrewList } from '../controllers/crew_controller.js';
const router = express.Router();
router.get('/', getCrewList);
router.get('/:id', getCrewById);
router.post('/', addCrew);
router.delete('/:id', deleteCrew);
router.put('/:id', editCrew);

export default router;
