//PACKAGES IMPORTS
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import xss from 'xss-clean';
import helmet from "helmet";
import mongoSanitize from 'express-mongo-sanitize';
import cors from "cors";
import fileupload from 'express-fileupload';
//TODO MAKE DELETE FOR IMAGE WHILE EDITING OR DELETING MANGA OR ANIME
//ROUTES IMPORTS
import animeRoutes from './routes/anime.js';
import mangaRoutes from './routes/manga.js';
import authRoutes from './routes/auth.js';
import categoryRoutes from './routes/category.js';
import chapterRoutes from './routes/chapter.js';
import statusRoutes from './routes/status.js';
import crewRoutes from './routes/crew.js';
import episodeRoutes from './routes/episode.js';
import userRoutes from './routes/user.js';
import seasonRoutes from './routes/season.js';
import contentCategoryRoutes from './routes/content_category.js';
import myListTypesRoutes from './routes/my_list_types.js';

const PORT = process.env.PORT || 5000;
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
app.use(fileupload({ createParentPath: true }));


app.use('/' + apiPath + '/anime', animeRoutes);
app.use('/' + apiPath + '/episode', episodeRoutes);
app.use('/' + apiPath + '/crew', crewRoutes);
app.use('/' + apiPath + '/manga', mangaRoutes);
app.use('/' + apiPath + '/chapter', chapterRoutes);
app.use('/' + apiPath + '/category', categoryRoutes);
app.use('/' + apiPath + '/auth', authRoutes);
app.use('/' + apiPath + '/status', statusRoutes);
app.use('/' + apiPath + '/user', userRoutes);
app.use('/' + apiPath + '/season', seasonRoutes);
app.use('/' + apiPath + '/content-category', contentCategoryRoutes);
app.use('/' + apiPath + '/my-list-types', myListTypesRoutes);




mongoose.connect(process.env.mongoDB, { useNewUrlParser: true }).then(() => {
    app.listen(PORT);

    console.log('connected to mongodb');
}).catch(error => {
    console.log(error.message);

});
