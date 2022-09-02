import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const mangaSchema = new Schema({

    mangaName: {
        type: String,
        unique: true,
    }, image: {
        type: String,
    },
    creationDate: {
        type: String,
    },
    chaptersCount: { type: Number, },
    rates: { type: Number, },

    mangaStatus: { type: Schema.Types.ObjectId, ref: 'Status' },
    mangaStory: {
        ar: {
            type: String, required: true,
        },
        en: {
            type: String, required: true,
        }
    },
    tierAge: { type: Number, },


    directory: {
        type: String,
    },
    type: {
        type: String,
    },


    categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    popular: { type: Boolean, required: true, },

}, { timestamps: true, collection: 'Manga', });

const Manga = mongoose.model('Manga', mangaSchema);
export default Manga;