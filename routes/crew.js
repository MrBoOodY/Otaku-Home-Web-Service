import express from 'express';
import { addCrew, deleteCrew, editCrew, getCrewById, getCrewList } from '../controllers/crew_controller.js';
import { verityJWT } from '../utils/helpers.js';
const router = express.Router();
router.get('/', getCrewList);
router.get('/:id', getCrewById);
router.post('/', verityJWT, addCrew);
router.delete('/:id', verityJWT, deleteCrew);
router.put('/:id', verityJWT, editCrew);

export default router;
