
import mongoose from 'mongoose';
import User from '../models/user.js';
import { sendItemIfExist } from '../utils/helpers.js';
import { populateMyList, sendUser } from '../utils/user_helpers.js';

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
