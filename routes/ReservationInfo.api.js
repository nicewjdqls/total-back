const express = require('express');
const router = express.Router();
const { reservationCheck, cancelReservation } = require('../controller/ReservationInfo.controller'); // controller 함수 불러오기

// 예약 정보 조회 (GET 요청)
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    console.log(`Fetching reservation info for user ${userId}`); // 디버깅용 콘솔 출력

    try {
        // req, res 객체를 전달
        await reservationCheck(req, res); 
    } catch (error) {
        console.error('Error while fetching reservation info:', error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
});

// 예약 취소 (POST 요청)
router.post('/cancel', async (req, res) => {
    try {
        await cancelReservation(req, res);
    } catch (error) {
        console.error('Error while cancelling reservation:', error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
});

module.exports = router;

