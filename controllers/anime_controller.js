import mongoose from 'mongoose';
import Anime from '../models/anime.js';

export const getAnimeList = async (req, res) => {
    try {
        const anime = await Anime.find();

        res.status(200).json(anime);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

export const getAnimeById = async (req, res) => {
    try {
        const anime = await Anime.findById(req.params.id);
        res.status(200).json(anime);
    } catch (error) {
        res.status(404).json({ error: error.message });

    }
}


export const addAnime = async (req, res) => {
    const anime = new Anime(req.body);
    try {
        await anime.save();
        res.status(201).json(anime);
    } catch (error) {
        res.status(409).json({ error: error.message });

    }
}



export const deleteAnime = async (req, res) => {
    try {
        const anime = await Anime.findByIdAndDelete(req.params.id);
        res.status(200).json(anime);
    } catch (error) {
        res.status(404).json({ error: error.message });

    }
}

export const editAnime = async (req, res) => {
    try {
        await Anime.findByIdAndUpdate(req.params.id, req.body);
        const anime = await Anime.findById(req.params.id);
        res.status(200).json(anime);
    } catch (error) {
        res.status(404).json({ error: error.message });

    }
}

