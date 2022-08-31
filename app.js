const express = require('express');
const mongoose = require('mongoose');
const Anime = require('./models/anime');
const mongoDB = require('./constants');
console.log(mongoDB);
const app  = express();
mongoose.connect(mongoDB,{useNewUrlParser: true}).then(() => {
app.listen(3000);
console.log('connected to mongodb');   
}).catch(error=>{
    console.log(error);  
    
});
app.get('/',(req,res)=>{
    const anime = new Anime({
        animeName: 'test',
        animeType: 'type',
        creationDate: '31/08/2022',
        episodeDuration: 1,
        episodesCount: 133,
        image: 'image',


    });
    anime.save().then(result=> res.send(result));
});