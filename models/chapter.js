import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const chapterSchema = new Schema({
    manga: { type: Schema.Types.ObjectId, ref: 'Manga' },
    linkEn: { type: String, },
    linkAr: { type: String, },
    chapterNumber: { type: Number, unique: true },

}, { timestamps: true, collection: 'Chapter', });

const Chapter = mongoose.model('Chapter', chapterSchema);
export default Chapter;