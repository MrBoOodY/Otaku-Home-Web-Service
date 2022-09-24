import express from 'express';
import { addManga, addRateToManga, deleteManga, editManga, getMangaById, getMangaList } from '../controllers/manga_controller.js';
import { verityJWT, verityJWTWithId } from '../utils/helpers.js';

import path from 'path';
const __dirname = path.resolve();

//Handling images
const uploadImage = function (req, res, next) {

    if (!req.files || !req.files.image) {
        return next();
    }


    const imagesPath = "images/Manga/";

    const imageFile = req.files.image;
    const imagePath = imagesPath + (req.params.id ?? Date.now()) + '.' + imageFile.mimetype.split('/')[1];;
    const pathToImage = __dirname + "/" + imagePath;

    //SAVE IMAGE TO IMAGES DIRECTORY
    imageFile.mv(pathToImage, (err) => {
        if (err) {
            return res.status(500).send(err);
        }
        req.body.image = imagePath;
        return next();
    });


}
//End of Handling images

const router = express.Router();
router.get('/', getMangaList);
router.get('/:id', getMangaById);
router.post('/', verityJWT, uploadImage, addManga);
router.post('/rate/:id', verityJWTWithId, addRateToManga);
router.delete('/:id', verityJWT, deleteManga);
router.put('/:id', verityJWT, uploadImage, editManga);

export default router;
