import express from 'express';
import { addStatus, deleteStatus, editStatus, getStatusById, getStatusList } from '../controllers/status_controller.js';
const router = express.Router();
router.get('/', getStatusList);
router.get('/:id', getStatusById);
router.post('/', addStatus);
router.delete('/:id', deleteStatus);
router.put('/:id', editStatus);

export default router;
