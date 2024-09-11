const express = require('express');
const router = express.Router();
const loginController = require('../controller/login.controller');
const session = require('express-session');

router.post('/', loginController.loginUser);

// 현재 로그인된 사용자 정보 반환
router.get('/current', (req, res) => {
    if (req.session.user) {
        res.status(200).json(req.session.user);
    } else {
        res.status(401).json({ message: '로그인 상태가 아닙니다.' });
    }
});

module.exports = router;