import mongoose from 'mongoose';

const schema = mongoose.Schema;

const contentCategorySchema = new schema({
    ar: {
        type: String,
        required: true,
        unique: true,
    },
    en: {
        type: String,
        required: true,
        unique: true,
    },
}, { collection: 'ContentCategory', });
contentCategorySchema.method('toClient', function () {
    const object = this.toObject();

    //Rename _id to be id
    object.id = object._id;
    //Deleting _id
    delete object._id;
    //Deleting __v
    delete object.__v;
    return object;
});
const ContentCategory = mongoose.model('ContentCategory', contentCategorySchema);
export default ContentCategory;