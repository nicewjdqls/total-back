const express = require('express');
const router = express.Router();
const purchasesController = require('../controller/purchases.controller');

// 방 예약 요청
router.post('/', purchasesController.reserveRoom);

// 사용자 구매 내역 조회 (옵션)
router.get('/user', purchasesController.getUserPurchases);

// 방 예약 가능 여부 확인 (옵션)
router.get('/roomcheck', purchasesController.checkRoomAvailability);

module.exports = router;