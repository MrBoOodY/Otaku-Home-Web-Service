

import mongoose from 'mongoose';

const schema = mongoose.Schema;

const crewSchema = new schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },

}, { collection: 'Crew', });
crewSchema.method('toClient', function () {
    const object = this.toObject();

    //Rename _id to be id
    object.id = object._id;
    //Deleting _id
    delete object._id;
    //Deleting __v
    delete object.__v;
    return object;
});
const Crew = mongoose.model('Crew', crewSchema);
export default Crew;