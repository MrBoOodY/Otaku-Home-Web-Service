import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const animeSchema = new Schema({

    animeName: {
        type: String, unique: true
    },
    creationDate: {
        type: String,
    },
    image: {
        type: String,
    },
    studio: {
        type: String,
    },
    animeType: {
        type: String,
    },
    tutorial: {
        type: String,
    },
    rates: { type: Number, },

    categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    popular: { type: Boolean, required: true, },
    tierAge: { type: Number, },
    episodesCount: { type: Number, },
    episodeDuration: { type: Number, },
    animeStatus: { type: Schema.Types.ObjectId, ref: 'Status' },

    animeStory: {
        ar: {
            type: String, required: true,
        },
        en: {
            type: String, required: true,
        }
    },
    animeSeason: {
        ar: {
            type: String, required: true,
        },
        en: {
            type: String, required: true,
        }
    },
    animeSource: {
        ar: {
            type: String, required: true,
        },
        en: {
            type: String, required: true,
        }
    },
    releaseDay: {
        ar: {
            type: String, required: true,
        },
        en: {
            type: String, required: true,
        }
    },
    crews: [{ type: Schema.Types.ObjectId, ref: 'Crew' }],
}, { timestamps: true, collection: 'Anime', });

const Anime = mongoose.model('Anime', animeSchema);
export default Anime;