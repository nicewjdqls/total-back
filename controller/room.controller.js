const { connection } = require('../model/Task');

// 방 옵션 조회
exports.getRoomOptions = async (req, res) => {
    try {
        const [results] = await connection.promise().query(
            'SELECT id, type FROM room_options'
        );
        res.status(200).json(results);
    } catch (err) {
        console.error('오류:', err);
        res.status(500).json({ message: '서버 오류입니다.' });
    }
};

// 방 번호 조회 (특정 방 옵션에 따른 방 번호)
exports.getRoomNumbersByOption = async (req, res) => {
  const { id } = req.params;

  try {
      const [results] = await connection.promise().query(
          'SELECT room_number FROM room_options WHERE type = (SELECT type FROM room_options WHERE id = ?)',
          [id]
      );

      res.status(200).json(results);
  } catch (err) {
      console.error('오류:', err);
      res.status(500).json({ message: '서버 오류입니다.' });
  }
};