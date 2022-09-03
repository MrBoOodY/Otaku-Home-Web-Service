
import User from '../models/user.js';
import { sendItemIfExist } from '../utils/helpers.js';

// GET BY ID
export const getUserByID = async (req, res) => {
    try {

        const user = await User.findById(req.params.id);
        sendItemIfExist(user, res);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}