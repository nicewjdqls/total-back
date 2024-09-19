const express = require('express');
const router = express.Router(); // express.Router()를 사용하여 새로운 라우터 인스턴스 생성
const { ChangeMyPagePW } = require('../controller/pwchange.controller'); // 비밀번호 변경 로직을 포함한 컨트롤러 함수 가져오기




// 비밀번호 변경 요청을 처리하는 POST 라우트
router.post('/', ChangeMyPagePW); // 루트 경로 ('/')에 대해 POST 요청이 들어오면 ChangeMyPagePW 함수 호출



module.exports = router; // 라우터 모듈을 내보내어 다른 파일에서 사용할 수 있도록 함
