const mongoose = require('mongoose');
const Order = require('../models/Order.model');
const Product = require('../models/Product.model');
const AppError = require('../utils/appError');

exports.createOrder = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { items, notes } = req.body;

        if (!items || items.length === 0) {
            await session.abortTransaction();
            session.endSession();
            return next(new AppError('No order items', 400));
        }

        let totalPrice = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.product).session(session);

            if (!product) {
                await session.abortTransaction();
                session.endSession();
                return next(new AppError(`Product not found: ${item.product}`, 404));
            }

            if (!product.available) {
                await session.abortTransaction();
                session.endSession();
                return next(new AppError(`${product.name} is not available`, 400));
            }

            if (product.stockQuantity < item.quantity) {
                await session.abortTransaction();
                session.endSession();
                return next(
                    new AppError(
                        `Insufficient stock for ${product.name}. Available: ${product.stockQuantity}`,
                        400
                    )
                );
            }

            product.stockQuantity -= item.quantity;
            await product.save({ session });

            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price
            });

            totalPrice += product.price * item.quantity;
        }

        const order = await Order.create(
            [{
                user: req.user.id,
                items: orderItems,
                notes,
                totalPrice
            }],
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            status: 'success',
            data: {
                order: order[0]
            }
        });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        next(err);
    }
};

exports.getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .populate('items.product', 'name price image');

        res.status(200).json({
            status: 'success',
            results: orders.length,
            data: {
                orders
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .populate('items.product', 'name price image');

        res.status(200).json({
            status: 'success',
            results: orders.length,
            data: {
                orders
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.updateOrderStatus = async (req, res, next) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            {
                new: true,
                runValidators: true
            }
        );

        if (!order) {
            return next(new AppError('Order not found', 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
                order
            }
        });
    } catch (err) {
        next(err);
    }
};