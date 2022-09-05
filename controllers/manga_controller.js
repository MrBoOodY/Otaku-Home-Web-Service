
import { populateCategory, populateStatus, sendItemIfExist, sendListToClient } from '../utils/helpers.js';
import Manga from '../models/manga.js';

export const getMangaList = async (req, res) => {
    try {
          let { page,  itemsCount, sortCreationDate, sortTitle, sortRates, sortYear, tierAge, title, category, studio, status,   type, year, popular, } = req.query;
        let sort ;
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
            console.log(mongoose.Types.ObjectId(category))
            category = {
                $ne: [
                    {
                        $filter: {
                            input: "$categories",
                            as: "category",
                            cond: {
                                $in: ["$$category", [mongoose.Types.ObjectId(category)]]
                            }
                        }
                    },
                    []
                ]
            }
            filters.push({ $expr: category });


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
        const serverAnimeList = await Manga.aggregate([
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
        const list = await Anime.populate(serverAnimeList, [
            populateStatus,
            populateCategory,
            populateCrews,
            populateSeason,
        ]);
        let serverList = []; 
        list.forEach((item) => serverList.push(Manga(item).toClient(item.rates,item.status)));
        res.status(200).json(serverList);
        return;
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

