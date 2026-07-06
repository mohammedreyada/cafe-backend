const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');
const { upload } = require('../middleware/upload.middleware');

// مسارات عامة (Public)
router.route('/')
    .get(categoryController.getAllCategories)
    .post(protect, restrictTo('Admin'), upload.single('image'), categoryController.createCategory);

router.route('/:id')
    .get(categoryController.getCategory)
    .patch(protect, restrictTo('Admin'), upload.single('image'), categoryController.updateCategory)
    .delete(protect, restrictTo('Admin'), categoryController.deleteCategory);

module.exports = router;