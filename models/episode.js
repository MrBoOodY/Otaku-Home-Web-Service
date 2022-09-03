import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const episodeSchema = new Schema({
    anime: { type: Schema.Types.ObjectId, ref: 'Anime' },
    linkFHD: { type: String, },
    linkHD: { type: String, },
    linkSD: { type: String, },
    episodeNumber: { type: Number, unique: true },

}, { timestamps: true, collection: 'Episode', });
episodeSchema.method('toClient', function () {
    const object = this.toObject();

    //Rename _id to be id
    object.id = object._id;
    //Deleting _id
    delete object._id;
    //Deleting __v
    delete object.__v;
    return object;
});
const Episode = mongoose.model('Episode', episodeSchema);
export default Episode;