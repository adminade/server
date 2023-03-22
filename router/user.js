const express = require('express');
const router = express.Router()

// 导入用户路由处理函数对应的模块
const user_routerHandler = require('../router_handler/user');
//注册新用户
router.post('/reguser', user_routerHandler.regUser);
//登录用户
router.post('/login', user_routerHandler.login);


//将路由对象共享出去
module.exports = router