const { body } = require('express-validator');

exports.createProductRules = [
    body('name').notEmpty().withMessage('Product name is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
    body('category').isMongoId().withMessage('Valid category ID is required'),
    body('stockQuantity').optional().isInt({ min: 0 }).withMessage('Quantity must be 0 or more'),
    body('lowStockThreshold').optional().isInt({ min: 0 })
];

exports.updateProductRules = [
    body('name').optional().notEmpty(),
    body('price').optional().isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
    body('category').optional().isMongoId(),
    body('stockQuantity').optional().isInt({ min: 0 }),
    body('available').optional().isBoolean()
];