import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const animeSchema = new Schema({

    title: {
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
    type: {
        type: String,
    },
    tutorial: {
        type: String,
    },
    rates: [{
        "rate": Number,
        "userId": { type: Schema.Types.ObjectId, ref: 'User', },
    }],
    contentCategory: [{
        "percent": Number,
        "type": { type: Schema.Types.ObjectId, ref: 'ContentCategory', },
        "userId": { type: Schema.Types.ObjectId, ref: 'User', },
    }],

    categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    popularity: { type: Number, },
    tierAge: { type: Number, },
    count: { type: Number, },
    duration: { type: Number, },
    year: { type: Number, },
    status: { type: Schema.Types.ObjectId, ref: 'Status' },
    season: { type: Schema.Types.ObjectId, ref: 'Season' },
    story: {
        ar: {
            type: String, required: true,
        },
        en: {
            type: String, required: true,
        }
    },

    source: {
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
animeSchema.method('toClient', function (rates, status, addedListAnime) {
    const object = this.toObject();
    if (object.contentCategory && object.contentCategory.length > 0) {
        for (var i = 0; i < object.contentCategory.length; i++) {
            delete object.contentCategory[i]._id;
        }
        delete object.contentCategory._id;
    }
    if (rates) {

        object.rates = rates;
    } else if (object.rates) {
        if (object.rates.length > 0) {
            object.rates = object.rates.reduce((a, b) => a.rate + b.rate) / object.rates.length;
        } else {
            object.rates = 0;
        }
    } else {
        object.rates = 0;

    }

    if (status) {
        object.status = status;
    }
    object.addedListAnime = addedListAnime;
    //Rename _id to be id 
    object.id = object._id;
    //Deleting _id
    delete object._id;
    //Deleting __v
    delete object.__v;
    return object;
});
const Anime = mongoose.model('Anime', animeSchema);
export default Anime;