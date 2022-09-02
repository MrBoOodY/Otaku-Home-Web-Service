import jwt from 'jsonwebtoken';

export const sendItemIfExist = async (item, res, next) => {
    if (item === null) {
        res.status(404).json({ 'message': 'this item doesn\'t exist' });

    } else {
        if (next) {
            try {

                const value = next;
                if (value) {
                    item = value;
                }
            } catch (error) {
                res.status(500).json({ message: error.message });

            }
        }
        res.status(200).json(item);


    }
};


export const verityJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    try {
        if (authHeader) {
            const accessToken = authHeader.split(' ')[1];
            jwt.verify(accessToken, process.env.jwt_sec, (err, user) => {
                if (err) {
                    res.status(404).json({ message: err.message });

                } else {
                    if (user.isAdmin) {
                        req.params.isAdmin = user.isAdmin;
                        next();
                    } else {
                        res.status(403).json({ message: 'You Are Not Authorized' });

                    }
                }
            });
        } else {
            res.status(404).json({ message: 'Missing Authorization Token' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const verityUserJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    try {
        if (authHeader) {
            const accessToken = authHeader.split(' ')[1];
            jwt.verify(accessToken, process.env.jwt_sec, (err, user) => {
                if (err) {
                    res.status(404).json({ message: err.message });

                } else {
                    if (user.isAdmin || req.params.id == user.id) {
                        req.params.isAdmin = user.isAdmin;
                        next();
                    } else {
                        res.status(403).json({ message: 'You Are Not Authorized' });

                    }
                }
            });
        } else {
            res.status(404).json({ message: 'Missing Authorization Token' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const destructPassword = function (user) {
    const { password, __v, ...others } = user._doc;
    return others;
}