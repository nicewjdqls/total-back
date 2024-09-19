const { connection } = require('../model/Task');
const bcrypt = require('bcrypt');

// 날짜 형식 변환 함수
function convertDateFormat(dateString) {
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    return `${year}-${month}-${day}`;
}

// 쿼리문을 상단에 정의
async function findUser(userId, userBirthDate, userPhone) {
    let query = 'SELECT userId FROM member WHERE 1=1';
    const params = [];

    if (userId) {
        query += ' AND userId = ?';
        params.push(userId);
    }
    if (userBirthDate) {
        query += ' AND userBirthDate = ?';
        params.push(userBirthDate);
    }
    if (userPhone) {
        query += ' AND userPhone = ?';
        params.push(userPhone);
    }

    const [rows] = await connection.promise().query(query, params);
    return rows.length ? rows[0].userId : null;
}

async function getCurrentPw(userId) {
    const query = 'SELECT userPw FROM member WHERE userId = ?';
    const [rows] = await connection.promise().query(query, [userId]);
    return rows.length ? rows[0].userPw : null;
}

async function updatePw(userId, newHashedPw) {
    const query = 'UPDATE member SET userPw = ? WHERE userId = ?';
    await connection.promise().query(query, [newHashedPw, userId]);
}

async function encryptionPw(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

// 아이디 찾기
async function FindUserId(req, res) {
    const { userBirthDate, userPhone } = req.body;
    console.log(`user_birthDate : ${userBirthDate}, phone : ${userPhone}`);

    try {
        const birth = convertDateFormat(userBirthDate);
        console.log(`birth : ${birth}`);

        if (birth) {
            const userId = await findUser(null, birth, userPhone);
            console.log(`userId : ${userId}`);

            if (userId) {
                return res.status(200).json({ success: true, message: "조건에 맞는 아이디가 있습니다", userId: userId });
            } else {
                return res.status(400).json({ success: false, message: "조건에 맞는 아이디가 없습니다" });
            }
        } else {
            return res.status(400).json({ success: false, message: "날짜를 형식에 맞게 입력해 주세요" });
        }
    } catch (error) {
        console.error("아이디 찾기 중 오류 발생:", error);
        return res.status(500).json({ success: false, message: "서버 오류가 발생했습니다" });
    }
}

// 비밀번호 찾기
async function FindPassword(req, res) {
    const { userId, userPhone } = req.body;
    console.log(`id : ${userId}, phone : ${userPhone}`);

    try {
        const user = await findUser(userId, null, userPhone);
        console.log(`user : ${userId}`);

        if (user) {
            return res.status(200).json({ success: true, message: "조건에 맞는 아이디가 있습니다" });
        } else {
            return res.status(400).json({ success: false, message: "조건에 맞는 아이디가 없습니다" });
        }
    } catch (error) {
        console.error("비밀번호 찾기 사용자 정보 확인 중 오류 발생:", error);
        return res.status(500).json({ success: false, message: "서버 오류가 발생했습니다" });
    }
}

// 비밀번호 변경
async function ChangePassword(req, res) {
    const { userId, newPw } = req.body;
    console.log(`userId : ${userId}, newPw : ${newPw}`);

    try {
        const user = await findUser(userId, null, null);
        console.log(`user : ${user}`);

        if (user) {
            const currentHashedPw = await getCurrentPw(userId);
            console.log(`currentHashedPw : ${currentHashedPw}`);

            const isMatch = await bcrypt.compare(newPw, currentHashedPw);
            console.log(`isMatch : ${isMatch}`);

            const encryption_pw = await encryptionPw(newPw);
            console.log(`encryption_pw : ${encryption_pw}`);

            if (isMatch) {
                return res.status(400).json({ success: false, message: "이전 비밀번호는 사용할 수 없습니다" });
            } else {
                await updatePw(userId, encryption_pw);
                return res.status(200).json({ success: true, message: "비밀번호가 성공적으로 변경되었습니다" });
            }
        } else {
            return res.status(400).json({ success: false, message: "아이디 정보가 없습니다" });
        }
    } catch (error) {
        console.error("비밀번호 변경 중 오류 발생:", error);
        return res.status(500).json({ success: false, message: "서버 오류가 발생했습니다" });
    }
}


module.exports = {
    FindUserId,
    FindPassword,
    ChangePassword,
};
