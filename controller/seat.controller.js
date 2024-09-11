const { connection } = require('../model/Task');

// 좌석 예약 생성
exports.reserveSeat = (req, res) => {
    const { seat_number, username } = req.body; // 필드 이름 수정

    // 좌석이 이미 예약되어 있는지 확인하는 쿼리
    const checkQuery = 'SELECT * FROM seats WHERE seat_number = ? AND username IS NOT NULL';
    connection.query(checkQuery, [seat_number], (err, results) => {
        if (err) {
            return res.status(500).send('서버 오류');
        }

        if (results.length > 0) {
            return res.status(400).send('해당 좌석은 이미 예약되어 있습니다.');
        }

        // 좌석 예약 삽입 쿼리
        const insertQuery = 'INSERT INTO seats (seat_number, username) VALUES (?, ?)';
        connection.query(insertQuery, [seat_number, username], (err, results) => {
            if (err) {
                return res.status(500).send('서버 오류');
            }
            res.status(201).send('좌석 예약이 완료되었습니다.');
        });
    });
};


