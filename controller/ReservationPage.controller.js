const { connection } = require('../model/Task');

async function reservation(req, res) {
    console.log(req.body);
    try {
        const { userId, sitNum, reserveDate, chargeTime } = req.body;

        // 시작 시간과 종료 시간 계산
        const startDateTime = new Date(reserveDate);
        const endDateTime = new Date(startDateTime);
        endDateTime.setHours(endDateTime.getHours() + chargeTime); // chargeTime에 따라 종료 시간 설정

        // 예약이 겹치는지 확인하는 쿼리
        const checkQuery = `
            SELECT * FROM reservation 
            WHERE sitNum = ? 
            AND reserveDate = ? 
            AND (startTime < ? AND endTime > ?)
        `;

        const [rows] = await connection.promise().query(checkQuery, [sitNum, reserveDate, endDateTime, startDateTime]);

        if (rows.length > 0) {
            return res.status(400).json({ success: false, message: "좌석이 이미 예약되어 있습니다." });
        }

        // SQL 쿼리 실행 (reservation 테이블에 데이터 삽입)
        const query = `
            INSERT INTO reservation (userId, sitNum, reserveDate, startTime, endTime)
            VALUES (?, ?, ?, ?, ?)
        `;

        // 데이터 삽입
        await connection.promise().query(query, [userId, sitNum, reserveDate, startDateTime.toISOString().slice(0, 19).replace('T', ' '), endDateTime.toISOString().slice(0, 19).replace('T', ' ')]);

        // 성공 응답
        return res.status(200).json({ success: true, message: "성공" });
    } catch (error) {
        console.error('예약 오류:', error);
        return res.status(500).json({ success: false, message: '예약 중 오류가 발생했습니다.' });
    }
}

module.exports = {
    reservation
};
