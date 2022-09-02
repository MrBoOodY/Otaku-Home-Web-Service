import Crew from '../models/crew.js';

import { sendItemIfExist } from '../utils/helpers.js';

export const getCrewList = async (req, res) => {
    try {
        const crew = await Crew.find();

        res.status(200).json(crew);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getCrewById = async (req, res) => {
    try {
        const crew = await Crew.findById(req.params.id);
        sendItemIfExist(crew, res);
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}


export const addCrew = async (req, res) => {
    const crew = new Crew(req.body);
    try {
        await crew.save();
        res.status(201).json(crew);
    } catch (error) {
        res.status(409).json({ message: error.message });

    }
}



export const deleteCrew = async (req, res) => {
    try {
        const crew = await Crew.findByIdAndDelete(req.params.id);
        res.status(200).json(crew);
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}

export const editCrew = async (req, res) => {
    try {
        const crew = await Crew.findByIdAndUpdate(req.params.id, req.body);
        sendItemIfExist(crew, res, async () => {
            return await Crew.findById(req.params.id);
        });

    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}

