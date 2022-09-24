import express from 'express';
import { addAnimeToMyList, addMangaToMyList, editAccount, getUserByID } from '../controllers/user_controller.js';
import { checkIfValidationFailed, verityUserJWT } from '../utils/helpers.js';
import validator from 'express-validator';
const { check } = validator;
import path from 'path';
const __dirname = path.resolve();
const imagesPath = "images/users/";

//Handling images 
//Handling Profile Picture
const uploadProfilePicture = function (req, res, next) {
    if (!req.files || !req.files.profilePicture) {
        return next();
    }
    const profilePictureFile = req.files.profilePicture;
    const profilePicturePath = imagesPath + 'profilePicture - ' + req.params.id + '.' + profilePictureFile.mimetype.split('/')[1];

    const pathToProfilePicture = __dirname + "/" + profilePicturePath;

    //SAVE IMAGE TO IMAGES DIRECTORY
    profilePictureFile.mv(pathToProfilePicture, (err) => {
        if (err) {
            return res.status(500).send(err);
        }
        req.body.profilePicture = profilePicturePath;
        return next();
    });


}
//End Handling Profile Picture

//Handling Cover Image
const uploadCoverImage = function (req, res, next) {
    if (!req.files || !req.files.coverImage) {
        return next();
    }
    const coverImageFile = req.files.coverImage;
    const coverImagePath = imagesPath + 'coverImage - ' + req.params.id + '.' + coverImageFile.mimetype.split('/')[1];
    const pathToCoverImage = __dirname + "/" + coverImagePath;
    //SAVE IMAGE TO IMAGES DIRECTORY
    coverImageFile.mv(pathToCoverImage, (err) => {
        if (err) {
            return res.status(500).send(err);
        }
        req.body.coverImage = coverImagePath;
        return next();

    });


}
//End Handling Cover Image
//End Handling images

const router = express.Router();

router.get('/:id', verityUserJWT, getUserByID);
router.post('/my-anime-list/:id', verityUserJWT, addAnimeToMyList);

router.post('/my-manga-list/:id', verityUserJWT, addMangaToMyList);

router.put('/:id', verityUserJWT, uploadProfilePicture, uploadCoverImage, [
    check('email').isEmail().normalizeEmail().trim().withMessage('Please Enter A Valid Email'),
    check('password').isLength({ min: 8 }).trim().withMessage('Password Must be at least 8 characters'),
    check('firstName').isString().trim().withMessage('Please Enter A Valid Name for First Name'),
    check('lastName').isString().trim().withMessage('Please Enter A Valid Name for Last Name'),
    check('bio').isString().trim().withMessage('Please Enter A Valid bio'),
    check('location').isString().trim().withMessage('Please Enter A Valid location'),
    check('showMyList').isBoolean().trim().withMessage('Please Enter A Valid value for showMyList'),
    check('birthDate').isDate().trim().withMessage('Please Enter A Valid birthDate'),
    checkIfValidationFailed
], editAccount);
export default router;
