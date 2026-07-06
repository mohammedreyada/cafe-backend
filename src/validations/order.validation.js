const { body } = require('express-validator');

exports.createOrderRules = [
    body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
    body('items.*.product').isMongoId().withMessage('Invalid product ID'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('notes').optional().isString()
];