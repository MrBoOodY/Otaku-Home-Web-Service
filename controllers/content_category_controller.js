
import ContentCategory from '../models/content_category.js';
import { sendItemIfExist, sendListToClient } from '../utils/helpers.js';


export const getContentCategoryList = async (req, res) => {
    try {
        const contentCategory = await ContentCategory.find();

        res.status(200).json(sendListToClient(contentCategory));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getContentCategoryById = async (req, res) => {
    try {
        const contentCategory = await ContentCategory.findById(req.params.id);
        sendItemIfExist(contentCategory, res);
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}


export const addContentCategory = async (req, res) => {
    const insertedContentCategory = new ContentCategory(req.body);
    try {
        await insertedContentCategory.save();
        const contentCategory = await ContentCategory.findById(insertedContentCategory.id);
        res.status(201).json(contentCategory.toClient());
    } catch (error) {
        res.status(409).json({ message: error.message });

    }
}



export const deleteContentCategory = async (req, res) => {
    try {
        const contentCategory = await ContentCategory.findByIdAndDelete(req.params.id);
        sendItemIfExist(contentCategory, res);

    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}

export const editContentCategory = async (req, res) => {
    try {
        const editedContentCategory = await ContentCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
        sendItemIfExist(editedContentCategory, res);
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}

