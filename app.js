import express from 'express';
import mongoose from 'mongoose';
import { mongoDB } from './constants.js';
import animeRoutes from './routes/anime.js';
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use('/anime', animeRoutes);
mongoose.connect(mongoDB, { useNewUrlParser: true }).then(() => {
    app.listen(PORT);
    console.log('connected to mongodb');
}).catch(error => {
    console.log(error);

});
