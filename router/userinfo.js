const express = require('express');
const router = express.Router();

const userinfo_handler = require('../router_handler/userinfo_handler');
//获取用户的基本信息
router.get('/userinfo', userinfo_handler.getuserInfo)

router.post('/userinfo', userinfo_handler.updateUserInfo)

router.post('/updatePassword', userinfo_handler.updateUserPasseword)

module.exports = router; 