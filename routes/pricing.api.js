const express = require('express');
const router = express.Router();
const pricingController = require('../controller/pricing.controller');

// 가격 목록 조회
router.get('/', pricingController.getPricing);

module.exports = router;
