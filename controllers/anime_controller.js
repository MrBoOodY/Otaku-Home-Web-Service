
import Anime from '../models/anime.js';
import { sendItemIfExist, sendListToClient } from '../utils/helpers.js';

export const getAnimeList = async (req, res) => {
    try {
        const { page, size, animeName, animeStatus, studio, animeType, } = req.query;
        //TODO FINISH FILTER
        const serverAnimeList = await Anime.find({

        }).size(page).limit(size).populate('categories', 'ar en -_id').populate('animeStatus', 'ar en -_id').populate('crews', '-_id -__v');


        res.status(200).json(sendListToClient(serverAnimeList));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getAnimeById = async (req, res) => {
    try {
        const anime = await Anime.findById(req.params.id).populate('categories', 'ar en -_id').populate('animeStatus', 'ar en -_id').populate('crews', '-_id');
        sendItemIfExist(anime, res);
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}


export const addAnime = async (req, res) => {
    const anime = new Anime(req.body);
    try {
        await anime.save();
        res.status(201).json(anime.toClient());
    } catch (error) {
        res.status(409).json({ message: error.message });

    }
}



export const deleteAnime = async (req, res) => {
    try {
        const anime = await Anime.findByIdAndDelete(req.params.id).populate('categories', 'ar en -_id').populate('animeStatus', 'ar en -_id').populate('crews', '-_id');
        sendItemIfExist(anime, res);

    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}

export const editAnime = async (req, res) => {
    try {
        const anime = await Anime.findByIdAndUpdate(req.params.id, req.body, { new: true });
        sendItemIfExist(anime, res);
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}

