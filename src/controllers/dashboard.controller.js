const Order = require('../models/Order.model');
const Product = require('../models/Product.model');
const Category = require('../models/Category.model');
const User = require('../models/User.model');

exports.getDashboardStats = async (req, res, next) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        const [totalOrders, todayOrders, todayRevenue, monthlyRevenue, totalProducts, totalCategories, totalUsers, lowStockProducts] = await Promise.all([
            Order.countDocuments(),
            Order.countDocuments({ createdAt: { $gte: today } }),
            Order.aggregate([{ $match: { createdAt: { $gte: today }, status: 'Completed' } }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
            Order.aggregate([{ $match: { createdAt: { $gte: startOfMonth }, status: 'Completed' } }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
            Product.countDocuments(),
            Category.countDocuments(),
            User.countDocuments(),
            Product.find({ stockQuantity: { $lte: 5 } }).select('name stockQuantity')
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                totalOrders,
                todayOrders,
                todayRevenue: todayRevenue[0]?.total || 0,
                monthlyRevenue: monthlyRevenue[0]?.total || 0,
                totalProducts,
                totalCategories,
                totalUsers,
                lowStockProducts
            }
        });
    } catch (err) { next(err); }
};