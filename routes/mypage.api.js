// express 모듈을 가져오고, 라우터 인스턴스를 생성
const express = require('express');
const router = express.Router();

// mypage.controller에서 reservemypage, myPageRequest, deleteAccount 함수를 가져오기
const { reservemypage, myPageRequest, deleteAccount } = require('../controller/mypage.controller');

// 특정 사용자 ID에 대한 마이페이지 요청을 처리하는 GET 라우트 정의
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    console.log(`Fetching mypage for user ${userId}`);
    try {
        await reservemypage(req, res);
    } catch (error) {
        console.error('Error while fetching mypage:', error);
        res.status(500).send('서버 오류가 발생했습니다.');
    }
});

// 비밀번호 확인 라우트
router.post('/mypagePw', myPageRequest);

// 회원 탈퇴 라우트 추가
router.post('/deleteAccount', deleteAccount); // 추가된 부분

// 정의한 라우터 모듈을 외부로 내보내기
module.exports = router;
