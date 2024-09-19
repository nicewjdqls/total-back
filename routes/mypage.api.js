// express 모듈을 가져오고, 라우터 인스턴스를 생성
const express = require('express');
const router = express.Router();

// mypage.controller에서 reservemypage 함수를 가져오기
const { reservemypage, myPageRequest } = require('../controller/mypage.controller');

// 특정 사용자 ID에 대한 마이페이지 요청을 처리하는 GET 라우트 정의
router.get('/:userId', async (req, res) => {
    // URL 파라미터에서 userId 추출
    const { userId } = req.params;
    console.log(`Fetching mypage for user ${userId}`); // 디버깅을 위한 콘솔 출력

    // reservemypage 함수 호출로 사용자 정보 처리
    try {
        await reservemypage(req, res); // 비동기적으로 reservemypage 함수 호출
    } catch (error) {
        // 함수 호출 중 오류 발생 시, 오류를 콘솔에 기록하고 HTTP 500 상태 코드 응답
        console.error('Error while fetching mypage:', error);
        res.status(500).send('서버 오류가 발생했습니다.');
    }
});

router.post('/mypagePw',myPageRequest );

// 정의한 라우터 모듈을 외부로 내보내기
module.exports = router;