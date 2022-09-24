import express from 'express';
import { addAnime, addContentCategoryToAnime, addRateToAnime, deleteAnime, editAnime, getAnimeById, getAnimeList } from '../controllers/anime_controller.js';
import { verityJWT, verityJWTWithId } from '../utils/helpers.js';

import path from 'path';
const __dirname = path.resolve();

//Handling images
const uploadImage = function (req, res, next) {
    console.log(req.originalUrl)
    if (!req.files || !req.files.image) {
        return next();
    }


    const imagesPath = "images/Anime/" + Date.now() + '-' + Math.round(Math.random() * 1E9);
    console.log(imagesPath);
    const imageFile = req.files.image;
    const imagePath = imagesPath + imageFile.name;
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
router.get('/', getAnimeList);
router.get('/:id', getAnimeById);
router.post('/', verityJWT, uploadImage, addAnime);
router.post('/rate/:id', verityJWTWithId, addRateToAnime);
router.post('/content-category/:id', verityJWTWithId, addContentCategoryToAnime);
router.delete('/:id', verityJWT, deleteAnime);
router.put('/:id', verityJWT, uploadImage, editAnime);

export default router;
