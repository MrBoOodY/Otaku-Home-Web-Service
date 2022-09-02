import express from 'express';
import mongoose from 'mongoose';
import animeRoutes from './routes/anime.js';
import mangaRoutes from './routes/manga.js';
import authRoutes from './routes/auth.js';
import categoryController from './routes/category.js';
import chapterController from './routes/chapter.js';
import statusController from './routes/status.js';
import crewController from './routes/crew.js';
import episodeController from './routes/episode.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const apiPath = 'api';

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use('/' + apiPath + '/anime', animeRoutes);
app.use('/' + apiPath + '/episode', episodeController);
app.use('/' + apiPath + '/crew', crewController);
app.use('/' + apiPath + '/manga', mangaRoutes);
app.use('/' + apiPath + '/chapter', chapterController);
app.use('/' + apiPath + '/category', categoryController);
app.use('/' + apiPath + '/auth', authRoutes);
app.use('/' + apiPath + '/status', statusController);
mongoose.connect(process.env.mongoDB, { useNewUrlParser: true }).then(() => {
    app.listen(PORT);
    console.log('connected to mongodb');
}).catch(error => {
    console.log(error);

});
