const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller'); // Assumed created
const { protect, restrictTo } = require('../middleware/auth.middleware');
const { upload } = require('../middleware/upload.middleware');

router.route('/')
    .get(productController.getAllProducts)
    .post(protect, restrictTo('Admin'), upload.single('image'), productController.createProduct);

router.route('/:id')
    .get(productController.getProduct)
    .patch(protect, restrictTo('Admin'), upload.single('image'), productController.updateProduct)
    .delete(protect, restrictTo('Admin'), productController.deleteProduct);

module.exports = router;