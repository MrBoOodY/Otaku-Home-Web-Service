import mongoose from 'mongoose';

const schema = mongoose.Schema;

const animeSchema = new schema({
  
animeName:{type:String,
},
creationDate:{type:String,
},
image:{type:String,
},
studio:{type:String,
},
animeType:{type:String,
},
tutorial:{type:String,
}, 
rates:{type:Number,},
// categories:{},
popular:{type:Boolean,},
tierAge:{type:Number,},
episodesCount:{type:Number,},
episodeDuration:{type:Number,},
// animeState:{},
// animeStory:{},
// animeSeason:{},
// animeSource:{},
// releaseDay:{},
// crews:{},
},{timestamps: true, collection: 'Anime',});

const Anime = mongoose.model('Anime',animeSchema);
export default Anime;