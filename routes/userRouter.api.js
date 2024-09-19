const express = require('express');
const router = express.Router();
const userRouterController = require('../controller/userRouter.controller');


//아이디 찾기 라우터
router.post('/findId', userRouterController.FindUserId);

//비밀번호 찾기 라우터
router.post('/findPw', userRouterController.FindPassword);

//비밀번호 변경 라우터
router.post('/changePw', userRouterController.ChangePassword);


module.exports = router;