const Category = require('../models/Category.model');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.createCategory = async (req, res, next) => {
    try {
        if (req.file) req.body.image = `/uploads/${req.file.filename}`;
        const newCategory = await Category.create(req.body);
        res.status(201).json({ status: 'success', data: { category: newCategory } });
    } catch (err) { next(err); }
};

exports.getAllCategories = async (req, res, next) => {
    try {
        const features = new APIFeatures(Category.find(), req.query).filter().sort().paginate();
        const categories = await features.query;
        res.status(200).json({ status: 'success', results: categories.length, data: { categories } });
    } catch (err) { next(err); }
};

exports.getCategory = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return next(new AppError('Category not found', 404));
        res.status(200).json({ status: 'success', data: { category } });
    } catch (err) { next(err); }
};

exports.updateCategory = async (req, res, next) => {
    try {
        if (req.file) req.body.image = `/uploads/${req.file.filename}`;
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!category) return next(new AppError('Category not found', 404));
        res.status(200).json({ status: 'success', data: { category } });
    } catch (err) { next(err); }
};

exports.deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) return next(new AppError('Category not found', 404));
        res.status(204).json({ status: 'success', data: null });
    } catch (err) { next(err); }
};