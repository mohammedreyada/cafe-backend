const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const reportController = require('../controllers/report.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

// حماية كل مسارات لوحة التحكم بصلاحيات الأدمن فقط
router.use(protect, restrictTo('Admin'));

router.get('/stats', dashboardController.getDashboardStats);
router.get('/reports/daily', reportController.getDailyReport);
router.get('/reports/monthly', reportController.getMonthlyReport);

module.exports = router;