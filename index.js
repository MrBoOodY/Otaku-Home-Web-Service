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
import xss from 'xss-clean';
import helmet from "helmet";
import mongoSanitize from 'express-mongo-sanitize';
import cors from "cors";

const PORT = process.env.PORT || 3000;
const app = express();
const apiPath = 'api';

dotenv.config();
app.use(cors());
//dealing with DOS attacks prevention is to limit the actual payload ( limit : 10kb) 
app.use(express.json({ extended: true, limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(xss());
app.use(helmet());
app.use(mongoSanitize());
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
