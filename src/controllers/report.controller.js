const Order = require('../models/Order.model');
const Product = require('../models/Product.model');

exports.getDailyReport = async (req, res, next) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const report = await Order.aggregate([
            { $match: { createdAt: { $gte: today } } },
            { 
                $group: { 
                    _id: null, 
                    totalOrders: { $sum: 1 }, 
                    totalRevenue: { $sum: '$totalPrice' } 
                } 
            }
        ]);

        const topProducts = await Order.aggregate([
            { $match: { createdAt: { $gte: today } } },
            { $unwind: '$items' },
            { $group: { _id: '$items.product', totalSold: { $sum: '$items.quantity' } } },
            { $sort: { totalSold: -1 } },
            { $limit: 5 },
            { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
            { $unwind: '$product' },
            { $project: { name: '$product.name', totalSold: 1 } }
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                summary: report[0] || { totalOrders: 0, totalRevenue: 0 },
                topProducts
            }
        });
    } catch (err) { next(err); }
};

exports.getMonthlyReport = async (req, res, next) => {
    try {
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

        const report = await Order.aggregate([
            { $match: { createdAt: { $gte: startOfMonth } } },
            { 
                $group: { 
                    _id: null, 
                    totalOrders: { $sum: 1 }, 
                    totalRevenue: { $sum: '$totalPrice' } 
                } 
            }
        ]);

        const avgOrderValue = report[0] ? (report[0].totalRevenue / report[0].totalOrders) : 0;

        const topProducts = await Order.aggregate([
            { $match: { createdAt: { $gte: startOfMonth } } },
            { $unwind: '$items' },
            { $group: { _id: '$items.product', totalSold: { $sum: '$items.quantity' } } },
            { $sort: { totalSold: -1 } },
            { $limit: 5 },
            { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
            { $unwind: '$product' },
            { $project: { name: '$product.name', totalSold: 1 } }
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                summary: report[0] || { totalOrders: 0, totalRevenue: 0 },
                avgOrderValue,
                topProducts
            }
        });
    } catch (err) { next(err); }
};