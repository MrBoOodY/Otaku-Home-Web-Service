import EpisodeReleaseDay from '../models/episode_release_day.js';
import { populateStatus, sendItemIfExist, sendListToClient } from '../utils/helpers.js';


export const getEpisodeReleaseDayList = async (req, res) => {
    try {
        const episodeReleaseDay = await EpisodeReleaseDay.find().populate({
            path: 'anime',
            model: 'Anime',
            select: 'title image status -_id',
            populate: populateStatus
        });
        res.status(200).json(sendListToClient(episodeReleaseDay));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getEpisodeReleaseDayById = async (req, res) => {
    try {
        const episodeReleaseDay = await EpisodeReleaseDay.findById(req.params.id).populate({
            path: 'anime',
            model: 'Anime',
            select: 'title image status -_id',
            populate: populateStatus
        });
        sendItemIfExist(episodeReleaseDay, res);
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}


export const addEpisodeReleaseDay = async (req, res) => {
    const insertedEpisodeReleaseDay = new EpisodeReleaseDay(req.body);
    try {
  const episodeReleaseDay=      await insertedEpisodeReleaseDay.save().then(async (res) => {
            await res.populate({
                path: 'anime',
                model: 'Anime',
                select: 'title image -_id',
                populate: populateStatus
            });
        });
        res.status(201).json(episodeReleaseDay.toClient());
    } catch (error) {
        res.status(409).json({ message: error.message });

    }
}



export const deleteEpisodeReleaseDay = async (req, res) => {
    try {
        const episodeReleaseDay = await EpisodeReleaseDay.findByIdAndDelete(req.params.id). populate({
                path: 'anime',
                model: 'Anime',
                select: 'title image -_id',
                populate: populateStatus
           
        });
        sendItemIfExist(episodeReleaseDay);
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}

export const editEpisodeReleaseDay = async (req, res) => {
    try {
        const episodeReleaseDay = await EpisodeReleaseDay.findByIdAndUpdate(req.params.id, req.body,{new:true}).populate({
            path: 'anime',
            model: 'Anime',
            select: 'title image -_id',
            populate: populateStatus
        });
        sendItemIfExist(episodeReleaseDay, res);

    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}

