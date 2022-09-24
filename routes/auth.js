import express from 'express';
import { register, login, getAllAccounts, deleteAccount, forget, authMe, logout } from '../controllers/auth_controller.js';
import { checkIfValidationFailed, verityUserJWT } from '../utils/helpers.js';
import rateLimit from 'express-rate-limit';
import validator from 'express-validator';
const { body, check } = validator;
/*   
import nodemailer from "nodemailer";
import sendgridTransport from 'nodemailer-sendgrid-transport';
const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: process.env.transportApiKey,
    }
})); */
// import passport from 'passport';




const limit = rateLimit({
    max: 5, // number of chances
    windowMs: 60 * 60 * 1000, // 15 Minutes of 'ban'  
    message: 'Too many requests, please try again later.', // message to send
    skipSuccessfulRequests: true,
});
const router = express.Router();

//GET ALL ACCOUNTS
router.get('/', verityUserJWT, getAllAccounts);

router.post('/login',
    limit,
    [
        check('email').isEmail().normalizeEmail().trim().withMessage('Please Enter A Valid Email'),
        check('password').isLength({ min: 8 }).trim().withMessage('Password Must be at least 8 characters'),
        checkIfValidationFailed
    ], login);

// router.get('/facebook',   passport.authenticate('facebook', { authType: 'reauthenticate' }));
// router.get('/facebook/callback',
//     passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/auth/login' }),
//     function (req, res) {
//         console.log(res.cookie);
//         console.log(req.params);
//         res.redirect('/');
//     });  

router.post('/register', [
    check('email').isEmail().normalizeEmail().trim().withMessage('Please Enter A Valid Email'),
    check('password').isLength({ min: 8 }).trim().withMessage('Password Must be at least 8 characters'),
    check('firstName').isString().trim().withMessage('Please Enter A Valid Name for First Name'),
    check('lastName').isString().trim().withMessage('Please Enter A Valid Name for Last Name'),
    check('bio').isString().trim().withMessage('Please Enter A Valid bio'),
    check('location').isString().trim().withMessage('Please Enter A Valid location'),
    check('showMyList').isBoolean().trim().withMessage('Please Enter A Valid value for showMyList'),
    check('birthDate').isDate().trim().withMessage('Please Enter A Valid birthDate'),
    checkIfValidationFailed
], limit, register);

router.post('/forget', limit, forget);

router.post('/logout', limit, logout);

//Get Two Factor Authentication Base 32
router.get('/authMe', authMe);

router.delete('/:id', verityUserJWT, deleteAccount);



export default router;
