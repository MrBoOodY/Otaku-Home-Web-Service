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

const Status = mongoose.model('Status', statusSchema);
export default Status;