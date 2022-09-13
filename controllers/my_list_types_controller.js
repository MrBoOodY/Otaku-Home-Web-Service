
import MyListTypes from '../models/my_list_types.js';
import { sendItemIfExist, sendListToClient } from '../utils/helpers.js';


export const getMyListTypesList = async (req, res) => {
    try {
        const myListTypes = await MyListTypes.find();

        res.status(200).json(sendListToClient(myListTypes));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getMyListTypesById = async (req, res) => {
    try {
        const myListTypes = await MyListTypes.findById(req.params.id);
        sendItemIfExist(myListTypes, res);
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}


export const addMyListTypes = async (req, res) => {
    const insertedMyListTypes = new MyListTypes(req.body);
    try {
        await insertedMyListTypes.save();
        const myListTypes = await MyListTypes.findById(insertedMyListTypes.id);
        res.status(201).json(myListTypes.toClient());
    } catch (error) {
        res.status(409).json({ message: error.message });

    }
}



export const deleteMyListTypes = async (req, res) => {
    try {
        const myListTypes = await MyListTypes.findByIdAndDelete(req.params.id);
        sendItemIfExist(myListTypes, res);

    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}

export const editMyListTypes = async (req, res) => {
    try {
        const myListTypes = await MyListTypes.findByIdAndUpdate(req.params.id, req.body, { new: true });
        sendItemIfExist(myListTypes, res);
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}

