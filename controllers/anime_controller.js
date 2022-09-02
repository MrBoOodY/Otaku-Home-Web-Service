
import Anime from '../models/anime.js';
import { sendItemIfExist } from '../utils/helpers.js';

export const getAnimeList = async (req, res) => {
    try {
        const serverAnimeList = await Anime.find().populate('categories', 'ar en -_id').populate('animeStatus', 'ar en -_id').populate('crews', '-_id -__v');
        //REFACTOR THIS CODE AND DO IT FOR ALL OBJS
        const clientAnimeList = [];
        serverAnimeList.forEach((anime) => {
            clientAnimeList.push(anime.toClient());
        });
        res.status(200).json(clientAnimeList);
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
        res.status(200).json(anime);
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}

export const editAnime = async (req, res) => {
    try {
        const anime = await Anime.findByIdAndUpdate(req.params.id, req.body);
        sendItemIfExist(anime, res, async () => {
            return await Anime.findById(req.params.id).populate('categories', 'ar en -_id').populate('animeStatus', 'ar en -_id').populate('crews', '-_id');
        });
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}

