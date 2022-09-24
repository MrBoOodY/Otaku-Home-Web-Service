
import mongoose from 'mongoose';
import User from '../models/user.js';
import { sendItemIfExist } from '../utils/helpers.js';
import { sendUser } from '../utils/user_helpers.js';
import fs from 'fs';

// GET USER BY ID
export const getUserByID = async (req, res) => {
    try {

        const user = await User.aggregate([

            {
                $match: {
                    _id: mongoose.Types.ObjectId(req.params.id),
                }
            },



            { $unwind: "$myAnimeList" },
            /* 
                        {
                            $group: {
                                _id: "$myAnimeList.myListType",
                                count: { $sum: 1 },
                                isInArray: { $first: "$isInArray" }
                            }
                        },
                        {
                            $project: {
                                count: 1,
                                "_id": 0,
                                id: "$_id",
                            }
                        } */



        ]);
        sendUser(res, user);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


// Add Anime To My List
export const addAnimeToMyList = async (req, res) => {
    try {
        let { anime, myListType } = req.body;

        let user = await User.findById(req.params.id);
        let animeList = user.myAnimeList;
        const item = animeList.filter((element) => element.anime == anime);


        if (item.length > 0) {

            if (myListType == '631aeaaac62e1bc5d54f22bd') {
                const item = animeList.filter((element) => element.anime == anime && element.myListType == '631aeaaac62e1bc5d54f22bd');

                if (item.length > 0) {
                    const index = animeList.indexOf(item[0]);

                    animeList[index] = null;
                } else {

                    animeList.push({ anime: anime, myListType: myListType });


                }
            } else {
                const item = animeList.filter((element) => element.anime == anime && myListType == element.myListType);
                if (item.length > 0) {
                    const index = animeList.indexOf(item[0]);
                    animeList[index] = null;
                } else {
                    const item = animeList.filter((element) => element.anime == anime && myListType != element.myListType && element.myListType != '631aeaaac62e1bc5d54f22bd');
                    if (item.length > 0) {

                        const index = animeList.indexOf((element) => element.anime == anime);
                        animeList[index] = { anime: anime, myListType: myListType };
                    } else {

                        animeList.push({ anime: anime, myListType: myListType });
                    }

                }
            }

        } else {
            animeList.push({ anime: anime, myListType: myListType });

        }
        animeList = animeList.filter((element) => element != null);
        user = await User.findByIdAndUpdate(req.params.id, { myAnimeList: animeList }, { new: true });
        res.status(200).json(user.toClient());

    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}


// EDIT
export const editAccount = async (req, res) => {
    try {
        delete req.body.isAdmin;
        let user;
        user = new User(req.body)
        if (user.password) {

            user.passwordHash = user.password;

        }
        // check if email taken or not.  if email exist and id is not the same requested id it will throw error message
        if (req.body.email) {
            const isExist = await User.findOne({ email: req.body.email });
            if (isExist != null) {
                if (isExist._id.toString() != req.params.id.toString()) {
                    return res.status(422).json({ message: 'Email Address Already Exist Please Choose Another Email Address' });
                }
            }

        }

        // check if coverImage or profilePicture is the same or not. if not then it will be replaced by the new one
        if (req.body.coverImage || req.body.profilePicture) {


            user = await User.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });
            if (req.body.coverImage != user.coverImage && user.coverImage) {
                fs.unlink(user.coverImage, (err) => {
                    if (err) {
                        throw err;

                    }

                });
            }
            if (req.body.profilePicture != user.profilePicture && user.profilePicture) {
                fs.unlink(user.profilePicture, (err) => {
                    if (err) {
                        throw err;
                    }

                });
            }
        }

        // reassign the body to the user to update the new data 
        user = new User(req.body)
        const { _id, ...finalUser } = user._doc;
        user =
            await User.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.params.id) }, finalUser, {
                new: true
            });
        sendItemIfExist(user, res);

    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}
// Add Manga To My List
export const addMangaToMyList = async (req, res) => {
    try {
        let { manga, myListType } = req.body;

        let user = await User.findById(req.params.id);
        let mangaList = user.myMangaList;
        const item = mangaList.filter((element) => element.manga == manga);


        if (item.length > 0) {

            if (myListType == '631aeaaac62e1bc5d54f22bd') {
                const item = mangaList.filter((element) => element.manga == manga && element.myListType == '631aeaaac62e1bc5d54f22bd');

                if (item.length > 0) {
                    const index = mangaList.indexOf(item[0]);

                    mangaList[index] = null;
                } else {

                    mangaList.push({ manga: manga, myListType: myListType });


                }
            } else {
                const item = mangaList.filter((element) => element.manga == manga && myListType == element.myListType);
                if (item.length > 0) {
                    const index = mangaList.indexOf(item[0]);
                    mangaList[index] = null;
                } else {
                    const item = mangaList.filter((element) => element.manga == manga && myListType != element.myListType && element.myListType != '631aeaaac62e1bc5d54f22bd');
                    if (item.length > 0) {

                        const index = mangaList.indexOf((element) => element.manga == manga);
                        mangaList[index] = { manga: manga, myListType: myListType };
                    } else {

                        mangaList.push({ manga: manga, myListType: myListType });
                    }

                }
            }

        } else {
            mangaList.push({ manga: manga, myListType: myListType });

        }
        mangaList = mangaList.filter((element) => element != null);
        user = await User.findByIdAndUpdate(req.params.id, { myMangaList: mangaList }, { new: true });
        res.status(200).json(user.toClient());

    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}
