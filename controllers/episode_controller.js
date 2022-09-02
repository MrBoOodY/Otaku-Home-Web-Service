import Episode from '../models/episode.js';
import { sendItemIfExist } from '../utils/helpers.js';


export const getEpisodeList = async (req, res) => {
    try {
        const episode = await Episode.find().populate({
            path: 'anime',
            model: 'Anime',
            select: 'animeName image -_id',
            populate: {
                path: 'animeStatus',
                model: 'Status',
                select: 'ar en -_id'
            }
        });
        res.status(200).json(episode);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getEpisodeById = async (req, res) => {
    try {
        const episode = await Episode.findById(req.params.id).populate({
            path: 'anime',
            model: 'Anime',
            select: 'animeName image -_id',
            populate: {
                path: 'animeStatus',
                model: 'Status',
                select: 'ar en -_id'
            }
        });
        sendItemIfExist(episode, res);
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}


export const addEpisode = async (req, res) => {
    const episode = new Episode(req.body);
    try {
        await episode.save().then(async (res) => {
            await res.populate({
                path: 'anime',
                model: 'Anime',
                select: 'animeName image -_id',
                populate: {
                    path: 'animeStatus',
                    model: 'Status',
                    select: 'ar en -_id'
                }
            });
        });
        res.status(201).json(episode);
    } catch (error) {
        res.status(409).json({ message: error.message });

    }
}



export const deleteEpisode = async (req, res) => {
    try {
        const episode = await Episode.findByIdAndDelete(req.params.id).then(async (res) => {
            await res.populate({
                path: 'anime',
                model: 'Anime',
                select: 'animeName image -_id',
                populate: {
                    path: 'animeStatus',
                    model: 'Status',
                    select: 'ar en -_id'
                }
            });
        });
        res.status(200).json(episode);
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}

export const editEpisode = async (req, res) => {
    try {
        const episode = await Episode.findByIdAndUpdate(req.params.id, req.body);
        sendItemIfExist(episode, res, async () => {
            return await Episode.findById(req.params.id).populate({
                path: 'anime',
                model: 'Anime',
                select: 'animeName image -_id',
                populate: {
                    path: 'animeStatus',
                    model: 'Status',
                    select: 'ar en -_id'
                }
            });
        });

    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}

