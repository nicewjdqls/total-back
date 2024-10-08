const fetch = require('node-fetch');
const bcrypt = require('bcryptjs'); 
const { connection } = require('../model/Task.js');

const client_id = "FyxxfOYI_FhhmiKnjTHH";
const client_secret = "KSeJUD40UF";
const state = "test"; // 임시 지정
const redirectURI = encodeURI("http://localhost:5000/api/callback");

// 비밀번호 암호화 함수
async function encryptionPw(userPw) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hash_pw = await bcrypt.hash(userPw, salt);
        return hash_pw; // 해시화된 비밀번호 반환
    } catch (error) {
        console.error("오류", error);
        throw new Error("비밀번호 암호화 오류");
    }
}

// 네이버 연동 로그인
async function naverlogin(req, res) {
    console.log("네이버 로그인 요청 수신");
    const api_url = `https://nid.naver.com/oauth2.0/authorize?client_id=${client_id}&redirect_uri=${redirectURI}&response_type=code&state=${state}`;
    res.status(200).json({ success: true, api_url: api_url });
}

async function callback(req, res) {
    const { code, state } = req.query; // 쿼리 파라미터에서 code와 state 추출

    const api_url = `https://nid.naver.com/oauth2.0/token?client_id=${client_id}&client_secret=${client_secret}&redirect_uri=${redirectURI}&code=${code}&state=${state}&grant_type=authorization_code`;

    try {
        const response = await fetch(api_url);

        if (!response.ok) {
            const errorResponse = await response.text();
            console.error('Failed to fetch token:', response.status, errorResponse);
            return res.status(response.status).json({ success: false, message: "토큰을 가져오지 못했습니다", error: errorResponse });
        }

        const tokenRequest = await response.json();
        console.log("tokenRequest:", tokenRequest);

        if ("access_token" in tokenRequest) {
            const { access_token } = tokenRequest;
            const apiUrl = "https://openapi.naver.com/v1/nid/me";

            const data = await fetch(apiUrl, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });

            if (!data.ok) {
                console.error('Failed to fetch user data:', data.status);
                return res.status(data.status).json({ success: false, message: "사용자 데이터를 가져오지 못했습니다" });
            }

            const userData = await data.json();
            console.log("userData : ", userData);

            const naverId = userData.response.id; // 네이버 아이디
            const name = userData.response.name;
            const mobile = userData.response.mobile;
            const birthday = userData.response.birthday;
            const birthyear = userData.response.birthyear;
            const birthDate = `${birthyear}-${birthday}`; // 생년월일 변환
            const userPhone = mobile.replace(/-/g, ''); // 핸드폰 번호 변환

            const queryCheck = 'SELECT * FROM snsmember WHERE userId = ?';
            connection.query(queryCheck, [naverId], async (error, results) => {
                if (error) {
                    console.error('DB Query Error:', error);
                    return res.status(500).json({ success: false, message: "서버 오류 발생" });
                }

                // 사용자가 존재하지 않는 경우에만 삽입
                if (results.length === 0) {
                    const hashedUserPw = await encryptionPw(userPhone);
                    const queryInsert = 'INSERT INTO snsmember (userId, userName, userPhone, userBirthDate, userPw, created_at) VALUES (?, ?, ?, ?, ?, NOW())';
                    const values = [naverId, name, userPhone, birthDate, hashedUserPw];

                    connection.query(queryInsert, values, (insertError) => {
                        if (insertError) {
                            console.error('DB Insert Error:', insertError);
                            return res.status(500).json({ success: false, message: "회원가입 중 오류 발생" });
                        }
                        console.log('회원가입됨');
                    });
                }

                // 세션에 사용자 정보 저장
                req.session.user = { id: naverId, name: name };
                
                // 로그인 기록 추가
                const ipAddress = req.ip; // 클라이언트의 IP 주소 가져오기
                const historyInsertQuery = 'INSERT INTO login_history (userId, userType, ip_address) VALUES (?, ?, ?)';
                const userType = 'snsmember'; // 사용자 유형 설정
                connection.query(historyInsertQuery, [naverId, userType, ipAddress], (historyInsertError) => {
                    if (historyInsertError) {
                        console.error('DB Insert History Error:', historyInsertError);
                        return res.status(500).json({ success: false, message: "로그인 기록 중 오류 발생" });
                    }
                    console.log('로그인 기록 추가됨');
                });

                // 사용자 정보를 부모 창으로 전달하는 스크립트
                res.send(`
                    <script>
                        const userData = ${JSON.stringify(userData)};
                        window.opener.postMessage({ userData: userData }, 'http://localhost:3000');
                        window.close();
                    </script>
                `);
            });
        } else {
            return res.status(400).json({ success: false, message: "access_token이 없습니다" });
        }
    } catch (error) {
        console.error("Error fetching token:", error);
        return res.status(500).json({ success: false, message: "서버 오류 발생" });
    }
}

// 네이버 연동 해제 - 보류
async function naverdelete(req, res) {
    const { ACCESS_TOKEN, userId } = req.body;
    const api_url = `https://nid.naver.com/oauth2.0/token?client_id=${client_id}&client_secret=${client_secret}&access_token=${ACCESS_TOKEN}&service_provider=NAVER`;
    
    try {
        const response = await fetch(api_url);
        const deletetoken = await response.json();
        console.log(deletetoken);

        if (deletetoken.result === "success") {
            console.log("네이버 연동 해제 완료");

            // snsmember 테이블에서 삭제 쿼리 넣어야 함

            return res.status(200).json({ success: true, message: "네이버 연동 해제 완료" });
        }
    } catch (error) {
        console.log("네이버 연동 해제 중 오류");
        return res.status(500).json({ success: false, message: "네이버 연동해제 중 서버 오류" });
    }
};

module.exports = {
    naverlogin,
    callback,
    naverdelete,
};
