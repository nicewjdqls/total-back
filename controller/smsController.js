//smsController.js
const coolsms = require('coolsms-node-sdk').default;
const messageService = new coolsms('NCSZGBHK4FK25MJF', 'C1TMPDPQEWA1HTQTVBVA92KJZQZTUG9G');

const verificationCodes = {}; //인증 번호를 저장할 객체

async function sendSMS(req, res) {
    const { userPhone } = req.body;
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); //랜덤 번호 생성
    console.log(`userPhone : ${userPhone}, verificationCode : ${verificationCode}`);

    verificationCodes[userPhone] = verificationCode; //인증번호를 저장

    console.log(`code: ${verificationCodes[userPhone]}`, verificationCodes[userPhone]);

    try{
        const response = await messageService.sendOne({
            to: userPhone,
            from: "01075344448",
            text: `[다솜 스터디 카페] 인증번호\n${verificationCode}입니다`,
        });
        console.log("문자 메시지 전송 성공 : ", response);
        res.status(200).json({success:true, message: "문자 메시지가 성공적으로 전송되었습니다"});
    } catch (error) {
        res.status(500).json({success:false, message: "문자 메시지 전송 중 오류 발생" });
        console.error("문자 메시지 전송 실패:", error); // 서버 로그에 에러 기록
    }
};

//인증 번호 확인 함수
async function verifyCode(req, res) {
    const {userPhone, code} = req.body;
    console.log(`userPhone: ${userPhone}, code: ${code}`);

    //객체로 지정된 verificationCodes[userPhone]에 값이 있으면 true
    //verificationCodes[userPhone]와 code가 같은면 true 
    //그 후 && 로 비교
    console.log(`code: ${verificationCodes[userPhone]}`, verificationCodes[userPhone]);
    console.log(verificationCodes[userPhone] === code);

    if(verificationCodes[userPhone] && verificationCodes[userPhone] === code) {
        delete verificationCodes[userPhone]; // 인증 후 코드 삭제
        console.log("삭제된 코드 : " + verificationCodes[userPhone]);
        return res.status(200).json({ success: true, message: "인증 성공" });
    } else {
        return res.status(400).json({ success: false, message: "인증 번호가 일치하지 않습니다" });
    }
};


module.exports = {
    sendSMS,
    verifyCode,
}