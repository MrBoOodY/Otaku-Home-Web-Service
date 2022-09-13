import mongoose from 'mongoose';

const schema = mongoose.Schema;

const myListTypesSchema = new schema({
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
}, { collection: 'MyListTypes', });
myListTypesSchema.method('toClient', function () {
    const object = this.toObject();

    //Rename _id to be id
    object.id = object._id;
    //Deleting _id
    delete object._id;
    //Deleting __v
    delete object.__v;
    return object;
});
const MyListTypes = mongoose.model('MyListTypes', myListTypesSchema);
export default MyListTypes;