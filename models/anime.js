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
        "rate":Number,
        "userId":   {type:Schema.Types.ObjectId,ref: 'User', },
    }],

    categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    popular: { type: Boolean, required: true, },
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
animeSchema.method('toClient', function (rates,status) {
    const object = this.toObject();

    //Rename _id to be id 
    object.id = object._id; 
    object.rates = rates??0; 
    object.status = status;
 
    //Deleting _id
    delete object._id;
    //Deleting __v
    delete object.__v;
    return object;
});
const Anime = mongoose.model('Anime', animeSchema);
export default Anime;