const { connection } = require('../model/Task');

// 방 옵션 조회
exports.getRoomOptions = (req, res) => {
  const query = 'SELECT * FROM room_options'; // 방 옵션 조회 쿼리

  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).send('서버 오류');
    }
    res.status(200).json(results); // 방 옵션 리스트 반환
  });
};

