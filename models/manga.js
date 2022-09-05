import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const mangaSchema = new Schema({

    title: {
        type: String,
        unique: true,
    },
     image: {
        type: String,
    },
    directory: {
        type: String,
    },
    creationDate: {
        type: String,
    },
    count: { type: Number, },
    rates: { type: Number, },

    status: { type: Schema.Types.ObjectId, ref: 'Status' },
    story: {
        ar: {
            type: String, required: true,
        },
        en: {
            type: String, required: true,
        }
    },
    tierAge: { type: Number, },
    year: { type: Number, },
 
    type: {
        type: String,
    },


    categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    popular: { type: Boolean, required: true, },

}, { timestamps: true, collection: 'Manga', });
mangaSchema.method('toClient', function () {
    const object = this.toObject();

    //Rename _id to be id
    object.id = object._id;
    //Deleting _id
    delete object._id;
    //Deleting __v
    delete object.__v;
    return object;
});
const Manga = mongoose.model('Manga', mangaSchema);
export default Manga;