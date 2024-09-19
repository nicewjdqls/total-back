const { connection } = require('../model/Task');
const bcrypt = require('bcrypt');

// 사용자의 정보를 조회하는 비동기 함수
async function reservemypage(req, res) {
    // URL 파라미터에서 userId 추출
    const { userId } = req.params; 
    console.log("Received user ID:", userId); // 디버깅을 위한 콘솔 출력

    try {
        // 비동기로 사용자 정보 가져오기
        const myInfo = await fetchUserInfo(userId);
        console.log(myInfo); // 사용자 정보 출력 (디버깅)

        if (myInfo) {
            // 사용자 정보가 존재하는 경우, HTTP 200 상태 코드와 함께 JSON 응답 반환
            return res.status(200).json({
                success: true,
                userId: myInfo.userId,
                name: myInfo.userName,
                phone: myInfo.userPhone,
                birth: myInfo.userBirthDate,
                created_at: myInfo.created_at
            });
        } else {
            // 사용자 정보가 없는 경우에 대한 처리
            return res.status(404).json({ success: false, message: "사용자 정보를 찾을 수 없습니다." });
        }
    } catch (error) {
        // 사용자 정보 조회 중 오류 발생 시, 오류를 콘솔에 기록하고 HTTP 500 상태 코드 응답
        console.error("내 정보 불러 오기 중 오류 발생:", error);
        return res.status(500).json({ success: false, message: "서버 오류가 발생했습니다." });
    }
}

// 데이터베이스에서 사용자 정보를 조회하는 비동기 함수
async function fetchUserInfo(userId) {
    try {
        // SQL 쿼리 정의: 주어진 userId로 사용자의 정보를 조회
        const query = `
            SELECT userId, userName, userPhone, userBirthDate, created_at
            FROM member
            WHERE userId = ?;
        `;
        const values = [userId]; // 쿼리에 바인딩할 값

        // Promise를 반환하여 비동기로 데이터베이스 쿼리 실행
        return new Promise((resolve, reject) => {
            connection.query(query, values, (error, results) => {
                if (error) {
                    // 쿼리 실행 중 오류 발생 시 오류를 콘솔에 기록하고 Promise를 reject
                    console.error("회원 정보 조회 오류", error);
                    return reject(error);
                }
                if (results.length > 0) {
                    // 결과가 존재하는 경우, 첫 번째 결과를 resolve
                    resolve(results[0]);
                } else {
                    // 결과가 없는 경우, null을 resolve
                    resolve(null);
                }
            });
        });
    } catch (error) {
        // 쿼리 실행 중 오류 발생 시 오류를 콘솔에 기록하고 다시 throw
        console.error("회원 정보 실행 오류:", error.message);
        throw error;
    }
}

// 마이페이지 입장 비밀번호 확인
async function myPageRequest(req, res) {
    const { userId, userPw } = req.body;
    console.log(`userId : ${userId}, userPw : ${userPw}`);
    try {
        // 저장된 비밀번호 가져오기
        const user = await getUser(userId);
        console.log(`user : ${JSON.stringify(user)}`);
        // 입력된 비밀번호와 저장된 비밀번호를 비교
        if (!user) {
            return res.status(404).json({ success: false, message: "사용자를 찾을 수 없습니다." });
        }
        const isMatch = await bcrypt.compare(userPw, user.userPw);
        console.log(`isMatch : ${isMatch}`);
        // 비밀번호가 일치하면 로그인 이력 기록 후 응답 반환
        if (isMatch) {
            return res.status(200).json({ success: true, message: "비밀번호 확인 성공 마이페이지 진입" }); 
        } else {
            return res.status(401).json({ success: false, message: "비밀번호가 일치하지 않습니다" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "서버 오류가 발생했습니다" }); // 서버 오류 시 500 상태 코드
        console.error("로그인 실행중 오류 발생:", error); // 서버 로그에 에러 기록
    }
}

// ID 비교
async function getUser(userId) {
    const query = "SELECT userPw, userName FROM member WHERE userId = ?";
    return new Promise((resolve, reject) => {
        connection.query(query, [userId], (error, results) => {
            if (error) {
                console.error("오류", error);
                return reject(error);
            }
            if (results.length > 0) {
                resolve(results[0]); // 중복된 아이디가 있음
            } else {
                resolve(null); // 중복된 아이디가 없음
            }
        });
    });
}

module.exports = {
    reservemypage,
    myPageRequest
};
