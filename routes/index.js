const express = require('express');
const router = express.Router();
const seatApi = require('./seat.api');
const roomApi = require('./room.api');
const purchasesApi = require('./purchases.api'); // 방 예약 관련 API
const loginApi = require('./LoginPage.api');
const signUpApi = require('./signUpPage.api'); // 회원가입 라우트

router.use('/seats', seatApi);
router.use('/room-options', roomApi);
router.use('/reserve-room', purchasesApi); // 방 예약 API 라우트
router.use('/login', loginApi);
router.use('/signUp', signUpApi);

module.exports = router;