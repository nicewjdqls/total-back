const express = require('express');
const router = express.Router();
const ReservationPage = require('../controller/ReservationPage.controller');

// 방 예약 요청
router.post('/', ReservationPage.reservation);

module.exports = router;
