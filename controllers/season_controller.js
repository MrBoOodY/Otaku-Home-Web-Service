
import Season from '../models/season.js';
import { sendItemIfExist } from '../utils/helpers.js';


export const getSeasonList = async (req, res) => {
    try {
        const season = await Season.find();

        res.status(200).json(sendListToClient(season));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getSeasonById = async (req, res) => {
    try {
        const season = await Season.findById(req.params.id);
        sendItemIfExist(season, res);
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}


export const addSeason = async (req, res) => {
    const insertedSeason = new Season(req.body);
    try {
        const season = await insertedSeason.save();
        res.status(201).json(season.toClient());
    } catch (error) {
        res.status(409).json({ message: error.message });

    }
}



export const deleteSeason = async (req, res) => {
    try {
        const season = await Season.findByIdAndDelete(req.params.id);
        sendItemIfExist(season, res);

    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}

export const editSeason = async (req, res) => {
    try {
        const editedStatus = await Season.findByIdAndUpdate(req.params.id, req.body, { new: true });
        sendItemIfExist(editedStatus, res);
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}

