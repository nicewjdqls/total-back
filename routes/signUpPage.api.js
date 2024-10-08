const express = require('express');
const router = express.Router();
const signUpController = require('../controller/signUp.controller');
const {sendSMS, verifyCode} = require('../controller/smsController');

// 회원가입 엔드포인트
router.post('/', signUpController.signUpUser);
router.get('/checkId/:id', signUpController.checkIdUser); // GET 요청, ID를 URL 파라미터로 받기
//SMS문자 인증 라우터
router.post('/sendSMSCode', sendSMS);

//인증번호 확인 라우터
router.post('/verifyCode', verifyCode);
module.exports = router;
