const express = require('express');
const router = express.Router();
const naverController = require('../controller/naverController'); // naverController 파일 추가

// 네이버 로그인 요청
router.get('/naverlogin', naverController.naverlogin); 
// 네이버 로그인 콜백 처리
router.get('/callback', naverController.callback); 

module.exports = router;
