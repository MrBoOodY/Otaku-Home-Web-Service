import mongoose from 'mongoose';

const schema = mongoose.Schema;

const categorySchema = new schema({
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
}, { collection: 'Category', });

const Category = mongoose.model('Category', categorySchema);
export default Category;