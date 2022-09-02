import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const episodeSchema = new Schema({
    anime: { type: Schema.Types.ObjectId, ref: 'Anime' },
    linkFHD: { type: String, },
    linkHD: { type: String, },
    linkSD: { type: String, },
    episodeNumber: { type: Number, unique: true },

}, { timestamps: true, collection: 'Episode', });

const Episode = mongoose.model('Episode', episodeSchema);
export default Episode;