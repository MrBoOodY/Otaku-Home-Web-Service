
import { categoryAggregate, populateCategory, populateStatus, sendItemIfExist } from '../utils/helpers.js';
import Manga from '../models/manga.js';

import mongoose from 'mongoose';
import { sendManga, sendMangaList } from '../utils/manga_helpers.js';
export const getMangaList = async (req, res) => {
    try {
        let { page, itemsCount, sortPopularity, sortCreationDate, sortTitle, sortRates, sortYear, tierAge, title, category, studio, status, type, year, popular, } = req.query;
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
        const serverMangaList = await Manga.aggregate([
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
        sendMangaList(res, serverMangaList);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getMangaById = async (req, res) => {
    let mangaId;
    if (req.params.id) {

        mangaId = mongoose.Types.ObjectId(req.params.id);
    } else {
        res.status(400).json({ message: "Manga ID Is Missing" });
    }
    try {

        let serverManga = await Manga.updateOne({ _id: req.params.id }, {
            $inc: { popularity: 1 }
        }

        );


        serverManga = await Manga.aggregate([
            {
                $match: {


                    _id:
                        mangaId,



                }
            },
            {
                $addFields: {
                    rates: { $avg: "$rates.rate" },
                }


            },

            {
                $lookup: {
                    as: "addedListManga",
                    from: "User",
                    pipeline: [

                        { $unwind: "$myMangaList" },
                        {
                            $project: {
                                isInArray: {
                                    $cond: [
                                        { $eq: ["$myMangaList.manga", mangaId] },
                                        1,
                                        0
                                    ]
                                },
                                myMangaList: 1
                            }
                        },
                        { $sort: { isInArray: -1 } },

                        { $match: { isInArray: 1 } },
                        {
                            $group: {
                                _id: "$myMangaList.myListType",
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
        sendManga(res, serverManga);

    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}


export const addManga = async (req, res) => {
    if (req.body.rates) {
        req.body.rates = undefined;

    }
    req.body.popularity = 0;

    const insertedManga = new Manga(req.body);
    try {
        let manga = await insertedManga.save();
        manga = await Manga.populate(manga, [populateCategory, populateStatus]);
        res.status(201).json(manga.toClient());
    } catch (error) {
        res.status(409).json({ message: error.message });

    }
}



export const deleteManga = async (req, res) => {
    try {
        const manga = await manga.findByIdAndDelete(req.params.id).populate(populateCategory).populate(populateStatus);
        sendItemIfExist(manga, res);


    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}

export const editManga = async (req, res) => {
    try {
        if (req.body.rates) {
            req.body.rates = undefined;

        }


        const editedManga = await Manga.findByIdAndUpdate(req.params.id, req.body,
            {
                new: true,
            })
            .populate(populateCategory)
            .populate(populateStatus);
        sendItemIfExist(editedManga, res);

    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}


export const addRateToManga = async (req, res) => {
    try {
        let { userId, rate } = req.body;
        if (userId) {

            userId = mongoose.Types.ObjectId(userId);
        }
        if (rate) {
            rate = parseInt(rate);
        }
        const manga = await Manga.updateOne({ _id: req.params.id }, [
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
        if (manga.matchedCount == 0) {
            res.status(404).json({ message: 'this item doesn\'t exist' });
        } else {
            if (manga.modifiedCount == 0) {
                res.status(500).json({ message: 'something went wrong' });

            } else {
                res.status(201).json({ message: 'Added successfully' });

            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}