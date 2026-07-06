const Product = require('../models/Product.model');
const Category = require('../models/Category.model');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

// إنشاء منتج جديد (Admin)
exports.createProduct = async (req, res, next) => {
    try {
        // إذا كان هناك رفع صورة، نضيف مسار الصورة للمنتج
        if (req.file) {
            req.body.image = `/uploads/${req.file.filename}`;
        }

        const newProduct = await Product.create(req.body);
        res.status(201).json({
            status: 'success',
            data: { product: newProduct }
        });
    } catch (err) {
        next(err);
    }
};

// جلب كل المنتجات (مع البحث، الفلترة، الترقيم)
exports.getAllProducts = async (req, res, next) => {
    try {
        const features = new APIFeatures(Product.find().populate('category', 'name'), req.query)
            .filter()
            .search(['name', 'description'])
            .sort()
            .paginate();
        
        const products = await features.query;

        res.status(200).json({
            status: 'success',
            results: products.length,
            data: { products }
        });
    } catch (err) {
        next(err);
    }
};

// جلب منتج واحد
exports.getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).populate('category', 'name');
        if (!product) {
            return next(new AppError('No product found with that ID', 404));
        }
        res.status(200).json({
            status: 'success',
            data: { product }
        });
    } catch (err) {
        next(err);
    }
};

// تعديل منتج (Admin)
exports.updateProduct = async (req, res, next) => {
    try {
        if (req.file) {
            req.body.image = `/uploads/${req.file.filename}`;
        }

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!updatedProduct) {
            return next(new AppError('No product found with that ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: { product: updatedProduct }
        });
    } catch (err) {
        next(err);
    }
};

// حذف منتج (Admin)
exports.deleteProduct = async (req, res, next) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return next(new AppError('No product found with that ID', 404));
        }
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        next(err);
    }
};