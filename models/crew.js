

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

const Crew = mongoose.model('Crew', crewSchema);
export default Crew;