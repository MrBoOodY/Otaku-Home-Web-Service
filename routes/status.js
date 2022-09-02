import express from 'express';
import { addStatus, deleteStatus, editStatus, getStatusById, getStatusList } from '../controllers/status_controller.js';
import { verityJWT } from '../utils/helpers.js';
const router = express.Router();
router.get('/', getStatusList);
router.get('/:id', getStatusById);
router.post('/', verityJWT, addStatus);
router.delete('/:id', verityJWT, deleteStatus);
router.put('/:id', verityJWT, editStatus);

export default router;
