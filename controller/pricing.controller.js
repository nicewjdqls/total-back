const { connection } = require('../model/Task');

// 요금제 조회 함수
exports.getPricing = async (req, res) => {
    try {
        const [results] = await connection.promise().query(
            'SELECT id, room_type, duration, price, expiration_days FROM pricing'
        );

        // 분 단위를 시간 단위로 변환
        const formattedResults = results.map(item => ({
            id: item.id,
            room_type: item.room_type,
            duration: (item.duration / 60).toFixed(2), // 분 단위를 시간으로 변환
            price: item.price,
            expiration_days: item.expiration_days
        }));

        res.status(200).json(formattedResults);
    } catch (err) {
        console.error('오류:', err);
        res.status(500).json({ message: '서버 오류입니다.' });
    }
};
