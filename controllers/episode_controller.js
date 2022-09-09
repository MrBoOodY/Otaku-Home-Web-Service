import Episode from '../models/episode.js';
import { populateStatus, sendItemIfExist, sendListToClient } from '../utils/helpers.js';


export const getEpisodeList = async (req, res) => {
    try {
        const episode = await Episode.find().populate({
            path: 'anime',
            model: 'Anime',
            select: 'title image status -_id',
            populate: populateStatus
        });
        res.status(200).json(sendListToClient(episode));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getEpisodeById = async (req, res) => {
    try {
        const episode = await Episode.findById(req.params.id).populate({
            path: 'anime',
            model: 'Anime',
            select: 'title image -_id',
            populate: populateStatus
        });
        sendItemIfExist(episode, res);
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}


export const addEpisode = async (req, res) => {
    const insertedEpisode = new Episode(req.body);
    try {
        const episode = await insertedEpisode.save().then(async (res) => {
            await res.populate({
                path: 'anime',
                model: 'Anime',
                select: 'title image -_id',
                populate: populateStatus
            });
        });
        res.status(201).json(episode.toClient());
    } catch (error) {
        res.status(409).json({ message: error.message });

    }
}



export const deleteEpisode = async (req, res) => {
    try {
        const episode = await Episode.findByIdAndDelete(req.params.id).populate({
            path: 'anime',
            model: 'Anime',
            select: 'title image status -_id',
            populate: populateStatus
        });

        sendItemIfExist(episode, res);
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}

export const editEpisode = async (req, res) => {
    try {
        const episode = await Episode.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate({
            path: 'anime',
            model: 'Anime',
            select: 'title image status -_id',
            populate: populateStatus
        });
        sendItemIfExist(episode, res);

    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}

