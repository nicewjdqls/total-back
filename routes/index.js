const express = require('express');
const router = express.Router();
const seatApi = require('./seat.api');
const roomApi = require('./room.api');
const pricingApi = require('./pricing.api'); // 가격 라우터 추가
const purchasesApi = require('./purchases.api'); // 방 예약 관련 API
const loginApi = require('./LoginPage.api');
const signUpApi = require('./signUpPage.api'); // 회원가입 라우트

// 각 API 경로에 맞는 라우터 설정
router.use('/seats', seatApi);
router.use('/room', roomApi); // 방 옵션 라우터
router.use('/pricing', pricingApi); // 가격 라우터
router.use('/room-numbers', roomApi); // 방 번호 라우터
router.use('/reservation', purchasesApi); // 방 예약 API 라우트
router.use('/login', loginApi);
router.use('/signUp', signUpApi);

module.exports = router;
