import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const sendItemIfExist = async (item, res) => {
    if (item === null) {
        res.status(404).json({ 'message': 'this item doesn\'t exist' });

    } else {

        item = item.toClient();
        res.status(200).json(item);


    }
};

export const sendListToClient = function (serverList) {
    const clientList = [];
    serverList.forEach((item) => {
        clientList.push(item.toClient());
    });
    return clientList;
}

export const verityJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    try {
        //check if authorization header is exist or not
        if (authHeader) {
            //obtain token
            const accessToken = authHeader.split(' ')[1];
            //verify token
            jwt.verify(accessToken, process.env.jwt_sec, async (err, responseUser) => {
                if (err) {
                    res.status(404).json({ message: err.message });

                } else {
                    //check whether user is admin or user id is the same request user id 
                    if (responseUser.isAdmin) {
                        //find current user to check if he has the same token on DB or not
                        const user = await User.findById(responseUser.id);
                        //check if current header token is the same token on DB or not
                        if (user.accessToken == accessToken) {
                            req.params.isAdmin = responseUser.isAdmin;
                            next();
                        } else {
                            youAreNotAuthorized(res);
                        }

                    } else {
                        youAreNotAuthorized(res);

                    }
                }
            });
        } else {
            missingAuthorizationToken(res);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const verityUserJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    try {
        //check if authorization header is exist or not
        if (authHeader) {
            //obtain token

            const accessToken = authHeader.split(' ')[1];

            //verify token
            jwt.verify(accessToken, process.env.jwt_sec, async (err, responseUser) => {
                if (err) {
                    res.status(403).json({ message: err.message });

                } else {
                    //check whether user is admin or user id is the same request user id 
                    if (responseUser.isAdmin || req.params.id == responseUser.id) {
                        //find current user to check if he has the same token on DB or not
                        const user = await User.findById(responseUser.id);
                        //check if current header token is the same token on DB or not
                        if (user.accessToken == accessToken) {
                            req.params.isAdmin = responseUser.isAdmin;
                            next();
                        } else {
                            youAreNotAuthorized(res);
                        }

                    } else {
                        youAreNotAuthorized(res);

                    }
                }
            });
        } else {
            missingAuthorizationToken(res);

        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const youAreNotAuthorized = (res) => { res.status(403).json({ message: 'You Are Not Authorized' }); }

export const missingAuthorizationToken = (res) => { res.status(403).json({ message: 'Missing Authorization Token' }); }