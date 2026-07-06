const { validationResult } = require('express-validator');
const AppError = require('../utils/appError');

exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // دمج جميع رسائل الخطأ في مصفوفة واحدة
        const errorMessages = errors.array().map(err => err.msg);
        return next(new AppError(errorMessages.join('. '), 400));
    }
    next();
};