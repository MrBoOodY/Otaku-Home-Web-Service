
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { sendItemIfExist, sendListToClient, youAreNotAuthorized } from '../utils/helpers.js';

// GET ALL 
export const getAllAccounts = async (req, res) => {
    try {

        const user = await User.find();
        res.status(200).json(sendListToClient(user));

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
            res.status(404).json({ message: 'email is not exist' });
        } else {
            if (originalUser.passwordHash === user.password) {
                const accessToken = signJWT(originalUser);

                originalUser.accessToken = accessToken;
                req.body.accessToken = accessToken;
                req.params.id = originalUser.id;
                req.params.isAdmin = originalUser.isAdmin;

                editAccount(req, res);
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
    const user = new User(req.body);
    try {
        let originalUser = await User.findOne({ email: user.email });
        if (originalUser == null) {
            res.status(404).json({ message: 'email is not exist' });
        } else {
            if (originalUser.passwordHash === user.password) {
                const accessToken = signJWT(originalUser);

                originalUser.accessToken = accessToken;
                req.body.accessToken = accessToken;
                req.params.id = originalUser.id;
                req.params.isAdmin = originalUser.isAdmin;

                editAccount(req, res);
            } else {

                res.status(401).json({ message: 'wrong password' });
            }
        }
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
            res.status(409).json({ message: 'Email is Already Exist' });
        }
    } catch (error) {
        res.status(409).json({ message: error.message });

    }
}



//DELETE 
export const deleteAccount = async (req, res) => {
    try {

        const user = await User.findByIdAndDelete(req.params.id);
        sendItemIfExist(user, res);





    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

// EDIT
export const editAccount = async (req, res) => {
    try {
        if (!req.params.isAdmin) {
            req.body.isAdmin = false;
        }
        let user;
        user = new User(req.body)
        if (user.password) {

            user.passwordHash = user.password;
        }
        const { _id, ...others } = user._doc;
        user =
            await User.findByIdAndUpdate(req.params.id, others, {
                new: true
            });
        sendItemIfExist(user, res);

    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}
//CREATE NEW JWT
function signJWT(user) {
    return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, process.env.jwt_sec, { expiresIn: user.isAdmin ? '15m' : '15d' });
}
