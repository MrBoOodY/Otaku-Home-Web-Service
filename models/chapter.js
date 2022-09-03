import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const chapterSchema = new Schema({
    manga: { type: Schema.Types.ObjectId, ref: 'Manga' },
    linkEn: { type: String, },
    linkAr: { type: String, },
    chapterNumber: { type: Number, unique: true },

}, { timestamps: true, collection: 'Chapter', });
chapterSchema.method('toClient', function () {
    const object = this.toObject();

    //Rename _id to be id
    object.id = object._id;
    //Deleting _id
    delete object._id;
    //Deleting __v
    delete object.__v;
    return object;
});
const Chapter = mongoose.model('Chapter', chapterSchema);
export default Chapter;