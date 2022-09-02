import Chapter from '../models/chapter.js';
import { sendItemIfExist } from '../utils/helpers.js';


export const getChapterList = async (req, res) => {
    try {
        const chapter = await Chapter.find().populate('manga', 'mangaName image -_id');

        res.status(200).json(chapter);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getChapterById = async (req, res) => {
    try {
        const chapter = await Chapter.findById(req.params.id).populate('manga', 'mangaName image -_id');
        sendItemIfExist(chapter, res);
    } catch (error) {
        res.status(404).json({ message: error.message });

    }
}


export const addChapter = async (req, res) => {
    const chapter = new Chapter(req.body);
    try {
        await chapter.save();
        res.status(201).json(chapter);
    } catch (error) {
        res.status(409).json({ message: error.message });

    }
}



export const deleteChapter = async (req, res) => {
    try {
        const chapter = await Chapter.findByIdAndDelete(req.params.id);
        res.status(200).json(chapter);
    } catch (error) {
        res.status(404).json({ message: error.message });

    }
}

export const editChapter = async (req, res) => {
    try {
        const chapter = await Chapter.findByIdAndUpdate(req.params.id, req.body);
        sendItemIfExist(chapter, res, async () => {
            return await Chapter.findById(req.params.id);
        });


    } catch (error) {
        res.status(404).json({ message: error.message });

    }
}

