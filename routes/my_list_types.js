import express from 'express';
import { addMyListTypes, deleteMyListTypes, editMyListTypes, getMyListTypesById, getMyListTypesList } from '../controllers/my_list_types_controller.js';
import { verityJWT } from '../utils/helpers.js';
const router = express.Router();
router.get('/', getMyListTypesList);
router.get('/:id', getMyListTypesById);
router.post('/', verityJWT, addMyListTypes);
router.delete('/:id', verityJWT, deleteMyListTypes);
router.put('/:id', verityJWT, editMyListTypes);

export default router;
