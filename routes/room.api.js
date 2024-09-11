const express = require('express');
const router = express.Router();
const roomController = require('../controller/room.controller');

router.get('/', roomController.getRoomOptions);

module.exports = router;
