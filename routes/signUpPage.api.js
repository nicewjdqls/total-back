const express = require('express');
const router = express.Router();
const signUpController = require('../controller/signUp.controller');

// 회원가입 엔드포인트
router.post('/', signUpController.signUpUser);
router.get('/checkId/:id', signUpController.checkIdUser); // GET 요청, ID를 URL 파라미터로 받기

module.exports = router;
