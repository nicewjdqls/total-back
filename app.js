const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const requestIp = require('request-ip');
const indexRouter = require('./routes/index');
const { connection } = require('./model/Task');

const app = express();

// CORS 설정
app.use(cors());

// 세션 설정
app.use(session({
    secret: 'secret_key', // 비밀키
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // 개발 환경에서는 false
}));

// 쿠키와 IP 주소 파서 설정
app.use(cookieParser());
app.use(requestIp.mw());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 라우트 설정
app.use('/api', indexRouter);

// MySQL 연결
connection.connect((err) => {
    if (err) {
        console.error('MySQL 연결 오류:', err);
        return;
    }
    console.log('MySQL 연결 성공!');

    // 테이블 생성 및 서버 시작
    StartServer();
});

function StartServer() {
    // 서버 시작
    app.listen(5000, () => {
        console.log('서버가 포트 5000에서 실행 중입니다');
    });
}
