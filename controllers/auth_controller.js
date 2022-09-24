
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { sendItemIfExist, sendListToClient, youAreNotAuthorized } from '../utils/helpers.js';
import fs from 'fs';

/* import dotenv from 'dotenv';
import passport from 'passport';
import fbstrategy from 'passport-facebook';
dotenv.config();
const FacebookStrategy = fbstrategy.Strategy;
passport.use(new FacebookStrategy({
    clientID: process.env.facebook_api_key,
    clientSecret: process.env.facebook_api_secret,
    callbackURL: 'http://196.155.208.135:3000/api/auth/facebook/callback',
    profileFields: ['id', 'first_name', 'last_name', 'picture', 'email', 'birthday', 'location']

},
    function (accessToken, refreshToken, profile, done) {
        console.log(accessToken);
        console.log(profile);
        process.nextTick(function () {
            //Check whether the User exists or not using profile.id
            if (config.use_database) {
                //Further code of Database.
            }
            return done(null, profile);
        });
    }
));
// FACEBOOK LOGIN
export const facebookLogin = async (req, res) => {

} */

// GET ALL 
export const getAllAccounts = async (req, res) => {
    try {

        const user = await User.find();
        res.status(200).json(sendListToClient(user));

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


// TODO: add social media login instead of this way 
//Social Media SIGN IN
export const socialLogin = async (req, res) => {
    const user = new User(req.body);
    try {

        const accessToken = signJWT(user);

        user.accessToken = accessToken;
        req.body.accessToken = accessToken;
        req.params.id = user.id;
        req.params.isAdmin = user.isAdmin;

        editAccount(req, res);

    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}

// LOGOUT
export const logout = async (req, res) => {

    try {

        const authHeader = req.headers.authorization;
        if (authHeader) {
            const accessToken = authHeader.split(' ')[1]

            const user = await User.findOne({ accessToken: accessToken });

            if (user != null) {

                req.body.accessToken = '';
                req.params.id = user.id;
                req.params.isAdmin = user.isAdmin;

                editAccount(req, res);
            }
        }

        else {

            youAreNotAuthorized(res);
        }


    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}

//SIGN IN
export const login = async (req, res) => {

    const user = new User(req.body);
    try {
        let originalUser = await User.findOne({ email: user.email });
        if (originalUser == null) {
            res.status(404).json({ message: 'Email does not exist' });
        } else {
            originalUser.passwordHash = user.password;
            if (originalUser.passwordHash === user.password) {
                const accessToken = signJWT(originalUser);


                originalUser =
                    await User.findByIdAndUpdate(originalUser._id, { accessToken: accessToken }, {
                        new: true
                    });
                sendItemIfExist(originalUser, res);
            } else {

                res.status(401).json({ message: 'wrong password' });
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}
//Forget Password
export const forget = async (req, res) => {

    try {
        const user = await User.findOne({ email: req.body.email });


        const verified = speakeasy.totp.verify({
            secret: user.secretKey,
            encoding: 'base32',
            token: req.body.userToken
        });
        if (verified) {
            const accessToken = signJWT(user);
            user.password = req.body.password;
            user.accessToken = accessToken;
            req.body = user;
            req.params.id = user.id;
            req.params.isAdmin = user.isAdmin;


            editAccount(req, res);
        } else {

            res.status(403).json({ message: "invalid code" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}
//Get Two Factor Authentication Base 32
export const authMe = async (req, res) => {
    try {
        const secretKey = speakeasy.generateSecret({ length: 20, name: 'Otaku Home' });
        await QRCode.toDataURL(secretKey.otpauth_url, function (err, url) {

            if (err) {
                res.status(500).json({ message: err.message });
            } else {
                res.status(201).json({ secretKey: secretKey.base32, qrUrl: url });
            }

        });

    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}


//SIGN UP
export const register = async (req, res) => {
    req.body.isAdmin = false;
    const user = new User(req.body);
    user.passwordHash = user.password;

    try {
        const exist = await User.findOne({ email: user.email });
        if (exist == null) {

            await user.save();

            res.status(201).json(user.toClient());
        } else {
            if (req.params.isSocial) {
                req.body = exist;
                socialLogin(req, res);
            } else {

                res.status(409).json({ message: 'Email Already Exist' });
            }
        }
    } catch (error) {
        res.status(409).json({ message: error.message });

    }
}




//DELETE 
export const deleteAccount = async (req, res) => {
    try {

        const user = await User.findByIdAndDelete(req.params.id);
        if (user != null) {

            if (user.coverImage) {

                fs.unlink(user.coverImage, (err) => {
                    if (err) {
                        throw err;
                    }

                    console.log("Delete File successfully.");
                });
            }
            if (user.profilePicture) {

                fs.unlink(user.profilePicture, (err) => {
                    if (err) {
                        throw err;
                    }

                    console.log("Delete File successfully.");
                });
            }
        }
        sendItemIfExist(user, res);





    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

//CREATE NEW JWT
function signJWT(user) {
    return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, process.env.jwt_sec, { expiresIn: user.isAdmin ? '15m' : '15d' });
}
