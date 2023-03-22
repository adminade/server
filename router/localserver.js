const express = require('express');
const router = express.Router()


// 导入用户路由处理函数对应的模块
const user_routerHandler = require('../router_handler/user');

//注册新用户
router.post('/localserver', (req, res) => {
    res.send("ok")

});
//登录用户
router.get('/localserver', (req, res) => {
    res.send("ok")

});

router.get('/checklogin', (req, res) => {
    res.send('ok')
})

//------------------------------------------------------------------------------


const loginHandler = require('../router_handler/localserver_login');
const SMSHandler = require('../router_handler/localserver_SMS')
const { route } = require('./user');
// router.post('/onlogin', loginHandler.loginHandler)

//-----------------------------------------------------
//登录
router.post('/login', loginHandler.login)
//注册
router.post('/regUser', loginHandler.regUser)

//短信路由
router.get('/requestSMS', SMSHandler.sendSMS)

//将路由对象共享出去
module.exports = router