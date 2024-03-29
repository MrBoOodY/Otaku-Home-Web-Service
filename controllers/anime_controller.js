
import Anime from '../models/anime.js';
import { populateCrews, sendAnime, sendAnimeList } from '../utils/anime_helpers.js';
import { categoryAggregate, populateCategory, populateSeason, populateStatus, sendItemIfExist } from '../utils/helpers.js';

import mongoose from 'mongoose';
//GET ALL ANIME
export const getAnimeList = async (req, res) => {
    try {
        let { page, itemsCount, sortPopularity, sortCreationDate, sortTitle, sortRates, sortYear, tierAge, title, category, studio, status, season, type, year, popular, } = req.query;
        let sort = {};
        if (sortCreationDate) {
            sortCreationDate = parseInt(sortCreationDate ?? 1);
            sort['createdAt'] = sortCreationDate;
        }
        if (sortRates) {
            sortRates = parseInt(sortRates ?? 1);
            sort['rates'] = sortRates;
        }
        if (sortTitle) {
            sortTitle = parseInt(sortTitle ?? 1);

            sort['title'] = sortTitle;
        }
        if (sortYear) {
            sortYear = parseInt(sortYear ?? 1);
            sort['year'] = sortYear;
        }
        if (sortPopularity) {
            sortPopularity = -1;
            sort['popularity'] = sortPopularity;
        }
        let filters = [];
        if (title) {
            title = { $regex: title, $options: "i" };
            filters.push({ title: title });
        }
        if (category) {
            filters.push(categoryAggregate(category));


        }
        if (tierAge) {
            filters.push({ tierAge: parseInt(tierAge) });

        }
        if (studio) {
            filters.push({ studio: studio });

        }
        if (status) {
            filters.push({ status: mongoose.Types.ObjectId(status) });

        }
        if (season) {
            filters.push({ season: mongoose.Types.ObjectId(season) });

        }
        if (type) {
            filters.push({ type: type });

        }
        if (year) {
            filters.push({ year: parseInt(year) });

        }
        if (popular) {
            filters.push({ popular: Boolean(popular) });

        }
        if (Object.keys(filters).length == 0) {
            filters.push({});
        }

        if (itemsCount < 1) {
            itemsCount = 1;
        }
        if (page < 1) {
            page = 1;

        }
        if (sortPopularity) {
            page = 1;
            itemsCount = 20;

        }
        const pipeline = [];
        if (page) {
            pipeline.push({ $skip: parseInt((itemsCount ?? 20) * (page - 1)) })
        }
        if (itemsCount) {
            pipeline.push({ $limit: parseInt(itemsCount) })
        }



        pipeline.concat(sort ? [sort] : [])
        const serverAnimeList = await Anime.aggregate([
            {
                $match: {


                    $and:
                        filters,



                }
            },
            {
                $addFields: {
                    rates: { $avg: "$rates.rate" },
                }


            },

            ...pipeline,



        ]);

        sendAnimeList(res, serverAnimeList);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
//GET ANIME BY ID
export const getAnimeById = async (req, res) => {
    let animeId;
    if (req.params.id) {

        animeId = mongoose.Types.ObjectId(req.params.id);
    } else {
        res.status(400).json({ message: "Anime Id Is Missing" });
    }
    try {

        let serverAnime = await Anime.updateOne({ _id: req.params.id }, {
            $inc: { popularity: 1 }
        }
        );


        serverAnime = await Anime.aggregate([

            {
                $match: {
                    _id: animeId,
                }
            },
            {
                $addFields: {
                    rates: { $avg: "$rates.rate" },
                }
            },
            {
                $lookup: {
                    as: "addedListAnime",
                    from: "User",
                    pipeline: [

                        { $unwind: "$myAnimeList" },
                        {
                            $project: {
                                isInArray: {
                                    $cond: [
                                        { $eq: ["$myAnimeList.anime", animeId] },
                                        1,
                                        0
                                    ]
                                },
                                myAnimeList: 1
                            }
                        },
                        { $sort: { isInArray: -1 } },

                        { $match: { isInArray: 1 } },
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
                        }
                    ],
                }
            },

        ]);

        sendAnime(res, serverAnime);

    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}


//ADD ANIME 
export const addAnime = async (req, res) => {
    if (req.body.rates) {
        req.body.rates = undefined;

    }
    req.body.popularity = 0;
    const insertedAnime = new Anime(req.body);
    try {
        let anime = await insertedAnime.save();
        anime = await Anime.populate(anime, [populateCategory, populateCrews, populateSeason, populateStatus]);
        res.status(201).json(anime.toClient());

    } catch (error) {
        res.status(409).json({ message: error.message });

    }
}


//DELETE ANIME BY ID
export const deleteAnime = async (req, res) => {
    try {
        const anime = await Anime.findByIdAndDelete(req.params.id)
            .populate(populateCategory)
            .populate(populateStatus)
            .populate(populateCrews)
            .populate(populateSeason);
        sendItemIfExist(anime, res);

    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}

//EDIT ANIME BY ID
export const editAnime = async (req, res) => {
    try {
        if (req.body.rates) {
            req.body.rates = undefined;

        }


        const anime = await Anime.findByIdAndUpdate(req.params.id, req.body,
            {
                new: true,
            })
            .populate(populateCategory)
            .populate(populateStatus)
            .populate(populateCrews)
            .populate(populateSeason);
        sendItemIfExist(anime, res);
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}

//ADD RATE TO ANIME BY ID
export const addRateToAnime = async (req, res) => {
    try {
        let { userId, rate } = req.body;
        if (userId) {

            userId = mongoose.Types.ObjectId(userId);
        }
        if (rate) {
            rate = parseInt(rate);
        }
        const anime = await Anime.updateOne({ _id: req.params.id }, [
            {
                $set: {
                    rates: {
                        $cond: {
                            if: { $in: [userId, '$rates.userId'] },
                            then: {
                                $map: {
                                    input: '$rates',
                                    in: {
                                        $cond: {
                                            if: { $eq: ['$$this.userId', userId] },
                                            then: { userId: '$$this.userId', rate: rate },
                                            else: '$$this'
                                        }
                                    }
                                }
                            },
                            else: {
                                $concatArrays: ['$rates', [{ rate: rate, userId: userId }]]
                            }
                        }
                    }
                }
            }
        ], { new: true });
        if (anime.matchedCount == 0) {
            res.status(404).json({ message: 'this item doesn\'t exist' });
        } else {
            if (anime.modifiedCount == 0) {
                res.status(500).json({ message: 'something went wrong' });

            } else {
                res.status(201).json({ message: 'Added successfully' });

            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}

//ADD CONTENT CATEGORY TO ANIME BY ID
export const addContentCategoryToAnime = async (req, res) => {
    try {
        let { userId, type, percent } = req.body;
        if (userId) {

            userId = mongoose.Types.ObjectId(userId);
        }
        if (percent) {
            percent = parseInt(percent);
        }
        if (type) {
            type = mongoose.Types.ObjectId(type);

        }
        const anime = await Anime.updateOne({ _id: req.params.id }, [
            {
                $set: {
                    contentCategory: {
                        $cond: {
                            if: {
                                $and: [
                                    { $in: [userId, '$contentCategory.userId'], },
                                    { $in: [type, '$contentCategory.type'], }
                                ]
                            },
                            then: {
                                $map: {
                                    input: '$contentCategory',
                                    as: 'contentCategory',
                                    in: {
                                        $cond: {
                                            if: {
                                                $and: [
                                                    { $eq: [userId, '$$contentCategory.userId'], },
                                                    { $eq: [type, '$$contentCategory.type'], }
                                                ]
                                            },
                                            then: { userId: '$$contentCategory.userId', type: '$$contentCategory.type', percent: percent },
                                            else: '$$contentCategory'
                                        }
                                    }
                                }
                            },
                            else: {
                                $concatArrays: ['$contentCategory', [{ type: type, userId: userId, percent: percent }]]
                            }
                        },
                    }
                },
            },
        ], { new: true });
        if (anime.matchedCount == 0) {
            res.status(404).json({ message: 'this item doesn\'t exist' });
        } else {
            if (anime.modifiedCount == 0) {
                res.status(500).json({ message: 'something went wrong' });

            } else {
                res.status(201).json({ message: 'Added successfully' });

            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}