
import Anime from '../models/anime.js';
import { populateCrews, sendAnime, sendAnimeList } from '../utils/anime_helpers.js';
import { categoryAggregate, populateCategory, populateSeason, populateStatus, sendItemIfExist, sendListToClient } from '../utils/helpers.js';

import mongoose from 'mongoose'; 
export const getAnimeList = async (req, res) => {
    try {
        let { page,  itemsCount, sortCreationDate, sortTitle, sortRates, sortYear, tierAge, title, category, studio, status, season, type, year, popular, } = req.query;
        let sort ={};
        if (sortCreationDate) {
            sortCreationDate = parseInt(sortCreationDate ?? 1);
            sort['createdAt'] = sortCreationDate;
        }
        if (sortRates) {
            sortRates = parseInt(sortRates ?? 1);
            sort['rates'] = sortRates;
        }
        if (sortTitle) {
            sortTitle = parseInt(sortTitle ?? 1);

            sort['title'] = sortTitle;
        }
        if (sortYear) {
            sortYear = parseInt(sortYear ?? 1);
            sort['year'] = sortYear;
        } 
        let filters = [];
        if (title) {
            title = { $regex: title, $options: "i" };
            filters.push({ title: title });
        }
        if (category) {  
            filters.push( categoryAggregate(category) );


        }
        if (tierAge) {
            filters.push({ tierAge: parseInt(tierAge) });

        }
        if (studio) {
            filters.push({ studio: studio });

        }
        if (status) {
            filters.push({ status: mongoose.Types.ObjectId(status) });

        }
        if (season) {
            filters.push({ season: mongoose.Types.ObjectId(season) });

        }
        if (type) {
            filters.push({ type: type });

        }
        if (year) {
            filters.push({ year: parseInt(year) });

        }
        if (popular) {
            filters.push({ popular: Boolean(popular) });

        }
        if (Object.keys(filters).length == 0) {
            filters.push({});
        }

        if (itemsCount < 1) {
            itemsCount = 1;
        }
        if (page < 1) {
            page = 1;

        }
        const pipeline = []; 
        if(page){
            pipeline.push({$skip: parseInt((itemsCount ?? 20) * (page - 1) )})
         } 
         if(itemsCount){
            pipeline.push({$limit: parseInt(itemsCount)})
         } 

        

        pipeline.concat(sort? [sort] : []) 
        const serverAnimeList = await Anime.aggregate([
            {
                $match: {


                    $and:
                        filters,



                }
            },
            {
                $addFields: {
                    rates: { $avg: "$rates.rate" },
                }


            },
          
             
            ...pipeline,
              
      

        ]); 
        
        sendAnimeList(res,serverAnimeList );
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getAnimeById = async (req, res) => {
    try {
        const serverAnime = await Anime.aggregate([
            {
                $match: {


                     _id:
                     mongoose.Types.ObjectId(req.params.id),



                }
            },
            {
                $addFields: {
                    rates: { $avg: "$rates.rate" },
                }


            },
          
              
      

        ]);  
   
        sendAnime(res,serverAnime);
    
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}


export const addAnime = async (req, res) => {
    const insertedAnime = new Anime(req.body);
    try {
        let anime = await insertedAnime.save();
        anime = await Anime.findById(anime.id)
            .populate(populateCategory)
            .populate(populateStatus)
            .populate(populateCrews)
            .populate(populateSeason);
        res.status(201).json(anime.toClient());
    } catch (error) {
        res.status(409).json({ message: error.message });

    }
}



export const deleteAnime = async (req, res) => {
    try {
        const anime = await Anime.findByIdAndDelete(req.params.id)
            .populate(populateCategory)
            .populate(populateStatus)
            .populate(populateCrews)
            .populate(populateSeason);
        sendItemIfExist(anime, res);

    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}

export const editAnime = async (req, res) => {
    try {
        let rates = req.body.rates;
        if (rates) {
        delete    req.body.rates;

        }
        let anime = await Anime.findById(req.params.id);

        const index = anime.rates.findIndex(function (item) { return item.userId == rates.userId });

        if (index == -1) {

            anime.rates.push(rates);
        } else {

            anime.rates[index] = rates;
        }

        anime = await Anime.findByIdAndUpdate(req.params.id, anime,
            {
                new: true,
            })
            .populate(populateCategory)
            .populate(populateStatus)
            .populate(populateCrews)
            .populate(populateSeason);
        sendItemIfExist(anime, res);
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}

