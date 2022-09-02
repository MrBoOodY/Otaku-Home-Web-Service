
import Category from '../models/category.js';
import { sendItemIfExist } from '../utils/helpers.js';

export const getCategoryList = async (req, res) => {
    try {
        const category = await Category.find();

        res.status(200).json(category);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        sendItemIfExist(category, res);
    } catch (error) {
        res.status(404).json({ message: error.message });

    }
}


export const addCategory = async (req, res) => {
    const category = new Category(req.body);
    try {
        await category.save();
        res.status(201).json(category);
    } catch (error) {
        res.status(409).json({ message: error.message });

    }
}



export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        res.status(200).json(category);
    } catch (error) {
        res.status(404).json({ message: error.message });

    }
}

export const editCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body);
        sendItemIfExist(category, res, async () => {
            return await Category.findById(req.params.id);

        });

    } catch (error) {
        res.status(404).json({ message: error.message });

    }
}

