import Chapter from '../models/chapter.js';
import { sendItemIfExist, sendListToClient } from '../utils/helpers.js';


export const getChapterList = async (req, res) => {
    try {
        const chapter = await Chapter.find().populate('manga', 'title image -_id');

        res.status(200).json(sendListToClient(chapter));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getChapterById = async (req, res) => {
    try {
        const chapter = await Chapter.findById(req.params.id).populate('manga', 'title image -_id');
        sendItemIfExist(chapter, res);
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}


export const addChapter = async (req, res) => {
    const insertedChapter = new Chapter(req.body);
    try {
     const serverChapter=   await insertedChapter.save();
        const chapter = await Chapter.findById(serverChapter.id).populate('manga', 'title image -_id');
        res.status(201).json(chapter.toClient());
    } catch (error) {
        res.status(409).json({ message: error.message });

    }
}



export const deleteChapter = async (req, res) => {
    try {
        const chapter = await Chapter.findByIdAndDelete(req.params.id);
        sendItemIfExist(chapter, res);

    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}

export const editChapter = async (req, res) => {
    try {
        const chapter = await Chapter.findByIdAndUpdate(req.params.id, req.body,{new:true});
        sendItemIfExist(chapter, res );


    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}

