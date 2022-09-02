
import { sendItemIfExist } from '../utils/helpers.js';
import Manga from '../models/manga.js';

export const getMangaList = async (req, res) => {
    try {
        const manga = await Manga.find().populate('categories', 'ar en -_id').populate('mangaStatus', 'ar en -_id');

        res.status(200).json(manga);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getMangaById = async (req, res) => {
    try {
        const manga = await Manga.findById(req.params.id).populate('categories', 'ar en -_id').populate('mangaStatus', 'ar en -_id');
        sendItemIfExist(manga, res);
    } catch (error) {
        res.status(404).json({ message: error.message });

    }
}


export const addManga = async (req, res) => {
    const insertedManga = new Manga(req.body);
    try {
        await insertedManga.save();
        const manga = await Manga.findById(insertedManga.id).populate('categories', 'ar en -_id').populate('mangaStatus', 'ar en -_id');
        res.status(201).json(manga);
    } catch (error) {
        res.status(409).json({ message: error.message });

    }
}



export const deleteManga = async (req, res) => {
    try {
        const manga = await Manga.findByIdAndDelete(req.params.id).populate('categories', 'ar en -_id').populate('mangaStatus', 'ar en -_id');

        res.status(200).json(manga);

    } catch (error) {
        res.status(404).json({ message: error.message });

    }
}

export const editManga = async (req, res) => {
    try {
        const editedManga = await Manga.findByIdAndUpdate(req.params.id, req.body);
        sendItemIfExist(editedManga, res, async () => {
            return await Manga.findById(req.params.id).populate('categories', 'ar en -_id').populate('mangaStatus', 'ar en -_id');
        });

    } catch (error) {
        res.status(404).json({ message: error.message });

    }
}

