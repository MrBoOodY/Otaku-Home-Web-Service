import express from 'express';
import { addManga, addRateToManga, deleteManga, editManga, getMangaById, getMangaList } from '../controllers/manga_controller.js';
import { verityJWT } from '../utils/helpers.js';
const router = express.Router();
router.get('/', getMangaList);
router.get('/:id', getMangaById);
router.post('/', verityJWT, addManga);
router.post('/rate/:id', (req,res)=>{
    verityJWT(req,res,()=>addRateToManga(req,res),true);
});
router.delete('/:id', verityJWT, deleteManga);
router.put('/:id', verityJWT, editManga);

export default router;
