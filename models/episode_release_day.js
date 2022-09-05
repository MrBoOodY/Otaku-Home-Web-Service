import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const episodeReleaseDaySchema = new Schema({
    anime: { type: Schema.Types.ObjectId, ref: 'Anime' },
    releaseDay: { type: String, },
    

}, { timestamps: true, collection: 'EpisodeReleaseDay', });
episodeReleaseDaySchema.method('toClient', function () {
    const object = this.toObject();

    //Rename _id to be id
    object.id = object._id;
    //Deleting _id
    delete object._id;
    //Deleting __v
    delete object.__v;
    return object;
});
const EpisodeReleaseDay = mongoose.model('EpisodeReleaseDay', episodeReleaseDaySchema);
export default EpisodeReleaseDay;