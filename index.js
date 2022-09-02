import express from 'express';
import mongoose from 'mongoose';
import animeRoutes from './routes/anime.js';
import mangaRoutes from './routes/manga.js';
import authRoutes from './routes/auth.js';
import categoryRoutes from './routes/category.js';
import chapterRoutes from './routes/chapter.js';
import statusRoutes from './routes/status.js';
import crewRoutes from './routes/crew.js';
import episodeRoutes from './routes/episode.js';
import userRoutes from './routes/user.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const apiPath = 'api';

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use('/' + apiPath + '/anime', animeRoutes);
app.use('/' + apiPath + '/episode', episodeRoutes);
app.use('/' + apiPath + '/crew', crewRoutes);
app.use('/' + apiPath + '/manga', mangaRoutes);
app.use('/' + apiPath + '/chapter', chapterRoutes);
app.use('/' + apiPath + '/category', categoryRoutes);
app.use('/' + apiPath + '/auth', authRoutes);
app.use('/' + apiPath + '/status', statusRoutes);
app.use('/' + apiPath + '/user', userRoutes);
mongoose.connect(process.env.mongoDB, { useNewUrlParser: true }).then(() => {
    app.listen(PORT);

    console.log('connected to mongodb');
}).catch(error => {
    console.log(error.message);

});
