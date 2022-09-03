import mongoose from 'mongoose';

const schema = mongoose.Schema;

const statusSchema = new schema({
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
}, { collection: 'Status', });
statusSchema.method('toClient', function () {
    const object = this.toObject();

    //Rename _id to be id
    object.id = object._id;
    //Deleting _id
    delete object._id;
    //Deleting __v
    delete object.__v;
    return object;
});
const Status = mongoose.model('Status', statusSchema);
export default Status;