const express = require('express');
const router = express.Router();
const purchasesApi = require('./ReservationPage.api'); // 방 예약 관련 API
const loginApi = require('./LoginPage.api');
const signUpApi = require('./signUpPage.api'); // 회원가입 라우트
const mypageApi = require('./mypage.api');
const pwchangeApi = require('./pwchange.api');
const userRouterApi = require('./userRouter.api');
const ReservationInfoApi = require('./ReservationInfo.api');
const naverRouter = require('./naverRouter.api');

// 각 API 경로에 맞는 라우터 설정
router.use('/reservation', purchasesApi); // 방 예약 API 라우트
router.use('/login', loginApi);
router.use('/signUp', signUpApi);
router.use('/mypages', mypageApi);
router.use('/pwchange', pwchangeApi);
router.use('/userRouter', userRouterApi);
router.use('/reservationInfo', ReservationInfoApi);
router.use('', naverRouter);  // 기본 경로에 naverRouter 사용

module.exports = router;
