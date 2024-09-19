const express = require('express');
const router = express.Router();
const roomController = require('../controller/room.controller');

// 방 옵션 조회
router.get('/room-options', roomController.getRoomOptions);

// 방 번호 조회 (특정 방 옵션에 따른 방 번호)
router.get('/room-numbers/:id', roomController.getRoomNumbersByOption);

module.exports = router;
