
import { populateCategory, populateStatus, sendItemIfExist, sendListToClient } from '../utils/helpers.js';
import Manga from '../models/manga.js';

export const getMangaList = async (req, res) => {
    try {
        let { page, size,   sortCreationDate,   sortTitle,sortRates, sortYear, ...others } = req.query;
        if(others.title){
        others.title = { "$regex": others.title, "$options": "i" };
      }  
      if(others.category){
        others.categories={"$in":[others.category]} 
          others.category = undefined
      }
        if (page < 0) {
            page = 1;

        }
        if (size < 1) {
            size = 1;
        }
        console.log(others.popular)

        const manga = await Manga.find( others)
        .sort({ createdAt: sortCreationDate, title: sortTitle, year: sortYear ,rates:sortRates})
        .limit(size)
        .skip((size ?? 100) * (page - 1))
        .populate(populateCategory)
        .populate(populateStatus);

        res.status(200).json(sendListToClient(manga));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getMangaById = async (req, res) => {
    try {
        const manga = await Manga.findById(req.params.id)
        .populate(populateCategory)
        .populate(populateStatus);
        sendItemIfExist(manga, res);
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}


export const addManga = async (req, res) => {
    const insertedManga = new Manga(req.body);
    try {
        await insertedManga.save();
        const manga = await Manga.findById(insertedManga.id).populate(populateCategory).populate(populateStatus);
        res.status(201).json(manga.toClient());
    } catch (error) {
        res.status(409).json({ message: error.message });

    }
}



export const deleteManga = async (req, res) => {
    try {
        const manga = await Manga.findByIdAndDelete(req.params.id).populate(populateCategory).populate(populateStatus);
        sendItemIfExist(manga, res);


    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}

export const editManga = async (req, res) => {
    try {
        const editedManga = await Manga.findByIdAndUpdate(req.params.id, req.body,{new:true});
        sendItemIfExist(editedManga, res );

    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}

