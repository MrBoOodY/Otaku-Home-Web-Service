import Anime from "../models/anime.js";
import { populateCategory, populateSeason, populateStatus } from "./helpers.js";

export const populateCrews =   {path:'crews',select: '-_id -__v',model:'Crew'} ;

export const sendAnime =  (res,list)=>{
    sendAnimeList(res,list,true);
}

export const sendAnimeList =async function(res,list,sendOne){
    await Anime.populate(list, [
        populateStatus,
        populateCategory,
        populateCrews,
        populateSeason,
    ]);   
    let serverList = [];  
    list.forEach((item) => serverList.push(Anime(item).toClient(item.rates,item.status)));
    if(serverList.length==0){
        res.status(404).json({message: 'this item doesn\'t exist'}); 
            
        }else{
            if(sendOne){
                serverList = serverList[0];
            }

            res.status(200).json(serverList);
 
        }
}