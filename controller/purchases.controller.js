const { connection } = require('../model/Task');

// 방 예약 함수
exports.reserveRoom = async (req, res) => {
    const { room_option_id, start_time, end_time, user_id, total_duration, pricing_id } = req.body;

    try {
        // 방 옵션 확인
        const [roomResults] = await connection.promise().query(
            'SELECT id, type FROM room_options WHERE id = ?',
            [room_option_id]
        );

        if (roomResults.length === 0) {
            return res.status(400).json({ message: '방 옵션을 찾을 수 없습니다.' });
        }

        const roomOptionId = roomResults[0].id;

        // 가격 정보 가져오기
        const [priceResults] = await connection.promise().query(
            'SELECT id, price, duration FROM pricing WHERE id = ?',
            [pricing_id]
        );

        if (priceResults.length === 0) {
            return res.status(400).json({ message: '가격 정보를 찾을 수 없습니다.' });
        }

        const price = priceResults[0].price;

        // 예약 생성
        const [reservationResult] = await connection.promise().query(
            'INSERT INTO reservation (user_id, room_option_id, start_time, end_time, total_duration) VALUES (?, ?, ?, ?, ?)',
            [user_id, roomOptionId, start_time, end_time, total_duration]
        );

        const reservationId = reservationResult.insertId;

        // 구매 기록 추가
        await connection.promise().query(
            'INSERT INTO purchases (reservation_id, room_option_id, pricing_id, purchase_date) VALUES (?, ?, ?, ?)',
            [reservationId, roomOptionId, pricing_id, new Date()]
        );

        // 시간 사용 기록 추가
        await connection.promise().query(
            'INSERT INTO time_usage (user_id, room_option_id, usage_start, usage_end, duration) VALUES (?, ?, ?, ?, ?)',
            [user_id, roomOptionId, start_time, end_time, total_duration]
        );

        // 잔여 시간 업데이트
        const [balanceResults] = await connection.promise().query(
            'SELECT remaining_time FROM user_room_balance WHERE user_id = ? AND room_option_id = ?',
            [user_id, roomOptionId]
        );

        if (balanceResults.length > 0) {
            const remainingTime = balanceResults[0].remaining_time - total_duration;

            if (remainingTime >= 0) {
                await connection.promise().query(
                    'UPDATE user_room_balance SET remaining_time = ? WHERE user_id = ? AND room_option_id = ?',
                    [remainingTime, user_id, roomOptionId]
                );
            } else {
                return res.status(400).json({ message: '잔여 시간이 부족합니다.' });
            }
        } else {
            await connection.promise().query(
                'INSERT INTO user_room_balance (user_id, room_option_id, remaining_time) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE remaining_time = VALUES(remaining_time)',
                [user_id, roomOptionId, -total_duration]
            );
        }

        console.log('예약 처리 성공');
        res.status(200).json({ message: '예약이 성공적으로 완료되었습니다.' });

    } catch (error) {
        console.error('예약 처리 오류:', error);
        res.status(500).json({ message: '예약 처리 중 오류가 발생했습니다.', error: error.message });
    }
};

// 사용자 구매 내역 조회 함수
exports.getUserPurchases = async (req, res) => {
    const username = req.query.username;

    try {
        const [userResults] = await connection.promise().query(
            'SELECT user_id FROM member WHERE name = ?',
            [username]
        );

        if (userResults.length === 0) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }

        const user_id = userResults[0].user_id;

        const [purchasesResults] = await connection.promise().query(
            'SELECT * FROM purchases WHERE reservation_id IN (SELECT id FROM reservation WHERE user_id = ?)',
            [user_id]
        );

        res.status(200).json(purchasesResults);
    } catch (err) {
        console.error('오류:', err);
        return res.status(500).json({ message: '서버 오류입니다.' });
    }
};
