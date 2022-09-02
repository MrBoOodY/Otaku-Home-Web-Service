
import Status from '../models/status.js';
import { sendItemIfExist } from '../utils/helpers.js';


export const getStatusList = async (req, res) => {
    try {
        const status = await Status.find();

        res.status(200).json(status);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getStatusById = async (req, res) => {
    try {
        const status = await Status.findById(req.params.id);
        sendItemIfExist(status, res);
    } catch (error) {
        res.status(404).json({ message: error.message });

    }
}


export const addStatus = async (req, res) => {
    const insertedStatus = new Status(req.body);
    try {
        await insertedStatus.save();
        const status = await Status.findById(insertedStatus.id);
        res.status(201).json(status);
    } catch (error) {
        res.status(409).json({ message: error.message });

    }
}



export const deleteStatus = async (req, res) => {
    try {
        const status = await Status.findByIdAndDelete(req.params.id);
        res.status(200).json(status);

    } catch (error) {
        res.status(404).json({ message: error.message });

    }
}

export const editStatus = async (req, res) => {
    try {
        const editedStatus = await Status.findByIdAndUpdate(req.params.id, req.body);
        sendItemIfExist(editedStatus, res, async () => {
            return await Status.findById(req.params.id);
        });
    } catch (error) {
        res.status(404).json({ message: error.message });

    }
}

