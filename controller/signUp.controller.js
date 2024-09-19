// controller/signUp.controller.js
const { connection } = require('../model/Task');

// 회원가입
async function signUpUser(req, res) {
    const { userId, userPw, userName, userPhone, userBirthDate } = req.body;

    // 유효성 검사
    if (!userId || !userPw || !userName || !userPhone || !userBirthDate) {
        console.log(req.body);
        console.log(data);
        return res.status(400).json({ success: false, message: '빈칸을 다 채워주세요' });
    }

    // 비밀번호 암호화
    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    const hashedPw = await bcrypt.hash(userPw, saltRounds);

    const birthDate = new Date(userBirthDate).toISOString().split('T')[0]; // 'YYYY-MM-DD' 포맷으로 변환

    // 데이터베이스에 사용자 추가
    const query = 'INSERT INTO member (userId, userPw, userName, userPhone, userBirthDate, created_at) VALUES (?, ?, ?, ?, ?, NOW())';
    const values = [userId, hashedPw, userName, userPhone, birthDate];

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

    const query = 'SELECT userId FROM member WHERE userId = ?';
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
