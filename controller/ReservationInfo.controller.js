const { connection } = require('../model/Task'); // DB 연결 객체

// 예약 조회 함수 (GET 요청에 맞게 수정)
async function reservationCheck(req, res) {
    console.log('예약 정보 요청 수신'); // 요청 수신 로그 추가

    try {
        const { userId } = req.params; // URL의 파라미터에서 userId 추출
        console.log('받은 userId:', userId);

        const query = `
            SELECT userId, sitNum, reserveDate, startTime, endTime
            FROM reservation
            WHERE userId = ?;
        `;

        connection.query(query, [userId], (error, results) => {
            if (error) {
                console.error('예약 정보 조회 중 오류 발생:', error);
                return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: '해당 사용자의 예약 정보를 찾을 수 없습니다.' });
            }

            return res.status(200).json(results);
        });
    } catch (error) {
        console.error('서버 처리 중 오류 발생:', error);
        return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
}

async function cancelReservation(req, res) {
    try {
        const { userId, reserveDate, startTime, endTime, sitNum } = req.body.deleteData;
        
        console.log('Received data:', req.body.deleteData);

        // 유효한 값인지 확인
        if (!reserveDate || !startTime || !endTime) {
            return res.status(400).json({ message: 'Invalid date/time values provided.' });
        }

        // 날짜와 시간 형식 변환
        const formattedReserveDate = reserveDate;
        const formattedStartTime = startTime;
        const formattedEndTime = endTime;

        const query = `
            DELETE FROM reservation
            WHERE userId = ? AND reserveDate = ? AND startTime = ? AND endTime = ? AND sitNum = ?;
        `;

        connection.query(query, [userId, formattedReserveDate, formattedStartTime, formattedEndTime, sitNum], (error, results) => {
            console.log('Received data:', req.body.results);
            if (error) {
                console.error('예약 취소 중 오류 발생:', error);
                return res.status(500).json({ message: '서버 오류가 발생했습니다.', error: error.message });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ message: '예약 정보가 존재하지 않습니다.' });
            }

            return res.status(200).json({ message: '예약이 성공적으로 취소되었습니다.' });
        });
    } catch (error) {
        console.error('서버 처리 중 오류 발생:', error);
        return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
}


module.exports = { reservationCheck, cancelReservation };
