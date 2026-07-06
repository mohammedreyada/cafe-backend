const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

// مسارات المستخدم (User)
router.route('/')
    .post(protect, orderController.createOrder)
    .get(protect, orderController.getMyOrders); // المستخدم يرى طلباته فقط

// مسارات الأدمن (Admin)
router.route('/all')
    .get(protect, restrictTo('Admin'), orderController.getAllOrders); // الأدمن يرى كل الطلبات

router.route('/:id/status')
    .patch(protect, restrictTo('Admin'), orderController.updateOrderStatus); // الأدمن يعدل حالة الطلب

module.exports = router;