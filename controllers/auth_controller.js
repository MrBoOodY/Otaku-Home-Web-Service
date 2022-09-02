
import User from '../models/user.js';
import jwt from 'jsonwebtoken';

// GET ALL ACCOUNTS IF ADMIN REQUESTING
export const getUserList = async (req, res) => {
    try {
        if (req.body.user.isAdmin) {

            const user = await User.find();



            res.status(200).json(user);
        } else {

            res.status(403).json({ message: 'You Are Not Authorized' });
        }


    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

//SIGN IN
export const login = async (req, res) => {
    const user = new User(req.body);
    try {
        const originalUser = await User.findOne({ email: user.email });
        if (originalUser == null) {

            res.status(404).json({ message: 'email is not exist' });
        } else {
            if (originalUser.passwordHash === user.password) {

                const accessToken = signJWT(originalUser);
                const { password, __v, ...others } = originalUser._doc;
                res.status(200).json({ ...others, accessToken: accessToken });
            } else {

                res.status(401).json({ message: 'wrong password' });
            }
        }
    } catch (error) {
        res.status(404).json({ message: error.message });

    }
}

//SIGN UP
export const register = async (req, res) => {
    const user = new User(req.body);
    user.passwordHash = user.password;

    try {
        const exist = await User.findOne({ email: user.email });
        if (exist == null) {

            await user.save();
            res.status(201).json(user);
        } else {
            res.status(409).json({ message: 'Email is Already Exist' });
        }
    } catch (error) {
        res.status(409).json({ message: error.message });

    }
}



export const deleteUser = async (req, res) => {
    try {
        const user = await User.find(req.params.userName);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: error.message });

    }
}

export const editUser = async (req, res) => {
    try {
        await verityJWT(req, res, async (req, res) => {
            await User.findByIdAndUpdate(req.params.id, req.body);
            const user = await User.findById(req.params.id);
            res.status(200).json(user);
        });

    } catch (error) {
        res.status(404).json({ message: error.message });

    }
}

function signJWT(user) {
    return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, process.env.jwt_sec, { expiresIn: '15d' });
}

export const verityJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    try {
        if (authHeader) {
            const accessToken = authHeader.split(' ')[1];
            jwt.verify(accessToken, process.env.jwt_sec, (err, user) => {
                if (err) {
                    res.status(404).json({ message: err });

                } else {
                    req.body.user = user;
                    next();

                }
            });
        } else {
            res.status(404).json({ message: 'Missing Authorization' });
        }
    } catch (error) {
        res.status(404).json({ message: error });
    }
}