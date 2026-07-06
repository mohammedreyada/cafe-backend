const Category = require('../models/Category.model');
const Product = require('../models/Product.model');

exports.getFullMenu = async (req, res, next) => {
    try {
        const categories = await Category.find();
        const products = await Product.find({ available: true });

        const menu = categories.map(category => ({
            _id: category._id,
            name: category.name,
            description: category.description,
            image: category.image,
            products: products.filter(
                product => product.category.toString() === category._id.toString()
            )
        }));

        res.status(200).json({
            status: 'success',
            data: {
                menu
            }
        });
    } catch (err) {
        next(err);
    }
};