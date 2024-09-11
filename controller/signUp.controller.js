// controller/signUp.controller.js
const { connection } = require('../model/Task');

// 회원가입
async function signUpUser(req, res) {
    const { user_id, user_pw, user_name, user_phone, user_birthDate } = req.body;

    // 유효성 검사
    if (!user_id || !user_pw || !user_name || !user_phone || !user_birthDate) {
        return res.status(400).json({ success: false, message: '빈칸을 다 채워주세요' });
    }

    // 비밀번호 암호화
    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    const hashedPw = await bcrypt.hash(user_pw, saltRounds);

    const birthDate = new Date(user_birthDate).toISOString().split('T')[0]; // 'YYYY-MM-DD' 포맷으로 변환

    // 데이터베이스에 사용자 추가
    const query = 'INSERT INTO member (user_id, user_pw, name, phone, birth, created_at) VALUES (?, ?, ?, ?, ?, NOW())';
    const values = [user_id, hashedPw, user_name, user_phone, birthDate];

    connection.query(query, values, (error, results) => {
        if (error) {
            console.error('회원가입 오류:', error);
            return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
        }
        res.status(201).json({ success: true, message: '회원가입 성공' });
    });
}

// 아이디 중복 체크
async function checkIdUser(req, res) {
    const { id } = req.params;

    const query = 'SELECT user_id FROM member WHERE user_id = ?';
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('중복 체크 오류:', error);
            return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
        }

        if (results.length > 0) {
            res.status(200).json({ success: false, message: '중복된 아이디입니다.' });
        } else {
            res.status(200).json({ success: true, message: '사용 가능한 아이디입니다.' });
        }
    });
}

module.exports = {
    signUpUser,
    checkIdUser
};
