const { connection } = require('../model/Task');
const bcrypt = require('bcrypt');

//비밀번호 변경-내정보 수정
async function ChangeMyPagePW(req, res) {
    const{userId, currentPw, newPw} = req.body;
    console.log(`userId : ${userId}, currentPw : ${currentPw}, newPw : ${newPw}`);
    try {
        //기존 비밀번호 조회
        const currentHashedPw = await getCurrentPw(userId);
        console.log(`currentHashedPw : ${currentHashedPw}`);
        //기존 비밀번호와 입력받은 현재 비밀번호 비교
        const isMatch = await bcrypt.compare(currentPw, currentHashedPw);
        if(isMatch){
            //기존 비밀번호와 새 비밀번호 비교
            const isMatch = await bcrypt.compare(newPw, currentHashedPw);
            console.log(`isMatch : ${isMatch}`);
            //새로운 비밀번호 암호화
            const encryption_pw = await encryptionPw(newPw);
            console.log(`encryption_pw : ${encryption_pw}`);
            if(isMatch){
                console.log("동일한 비밀번호")
                return res.status(200).json({success:false, message: "이전 비밀번호는 사용할 수 없습니다"});
            } else {
                //비밀번호 업데이트
                console.log("사용가능 비밀번호")
                await updatePw(userId, encryption_pw);
                return res.status(200).json({success:true, message: "비밀번호가 성공적으로 변경되었습니다"});
            }
        } else {
            return res.status(200).json({success:false, message : "현재 비밀번호를 정확하게 입력해주세요"});
        }
    } catch (error) {
        console.error("비밀번호 변경 중 오류 발생:", error); // 서버 로그에 에러 기록
        return res.status(500).json({success:false, message: "서버 오류가 발생했습니다" });
    }
};

//비밀번호 조회
async function getCurrentPw(userId) {
    const query = "SELECT userPw FROM member WHERE userId = ?"
    const values = [userId];
    return new Promise((resolve, reject) => {
        connection.query(query, values, (error, results) => {
            if (error) {
                console.error("기존 비밀번호 조회 오류", error);
                return reject(error);
            }
            if (results.length > 0) {
                resolve(results[0].userPw); // 비밀번호 찾기 성공
            } else {
                resolve(null); // 조건에 맞는 비밀번호 없음 
            }
        });
    });
};

//비밀번호 암호화
async function encryptionPw(userPw) {
    try{
        // 비밀번호 암호화를 위한 salt 생성
        const salt = await bcrypt.genSalt(10);
        // 생성된 salt를 사용하여 비밀번호를 해시화
        const hash_pw = await bcrypt.hash(userPw, salt);
        return hash_pw; // 해시화된 비밀번호 반환
    } catch (error){
        console.error("오류", error);
        // 암호화 오류를 상위 호출자에게 전달
        throw new Error("비밀번호 암호화 오류");
    }
};

//비밀번호 변경
async function updatePw(userId, newPw) {
    try{
        console.log(`Updating password for userId: ${userId} with newPw: ${newPw}`);
        const query = "UPDATE member SET userPw = ? WHERE userId = ?";
        const values = [newPw, userId];
        return new Promise((resolve, reject) => {
            connection.query(query, values, (error, results) => {
                if (error) {
                    console.error("비밀번호 업데이트 오류", error);
                    return reject(error);
                }
                console.log("데이터 삽입 성공", results);
                console.log(`Rows matched: ${results.affectedRows}`);
                return resolve(results);
            });
        });
    }catch (error) {
        console.error("비밀번호 변경 오류:", error.message);
        throw error;
    }
};

module.exports = {
    ChangeMyPagePW

};